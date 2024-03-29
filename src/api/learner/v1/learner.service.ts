import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { UserRole } from "../../../core/constant/UserRole"
import { logger } from "../../../core/logging/Logger"
import { GradeEntity } from "../../../entity/common/grade.entity"
import { RoleEntity } from "../../../entity/common/role.entity"
import { ContactEntity } from "../../../entity/contact/contact.entitiy"
import { MemberRoleEntity } from "../../../entity/member/memberRole.entitiy"
import { LearnerEntity } from "../../../entity/profile/learner.entity"
import LearnerForm from "../../../model/form/register/LearnerForm"
import LearnerFormToMemberEntityMapper from "../../../utils/mapper/learner/LearnerFormToMemberEntityMapper"
import TokenManager from "../../../utils/token/TokenManager"
import UserUtil from "../../../utils/UserUtil"
import { FileStorageUtils } from "../../../utils/files/FileStorageUtils"
import User from "../../../model/User"
import MyCourse from "../../../model/course/MyCourse"
import { launch } from "../../../core/common/launch"
import LearnerRepository from "../../../repository/LearnerRepository"
import LearnerProfile from "../../../model/profile/LearnerProfile"
import { isNotEmpty } from "../../../core/extension/CommonExtension"
import { LearnerRequestToMyCourseListMapper } from "../../../utils/mapper/course/offline/LearnerRequestToMyCourse.mapper"
import OnlineCourse from "../../../model/course/OnlineCourse"
import { OnlineCourseEntityToOnlineCourseMapper } from "../../../utils/mapper/course/online/OnlineCourseEntityToOnlineCourse.mapper"
import { CoinEntity } from "../../../entity/coins/coin.entity"

@Injectable()
export class LearnerService {
    constructor(
        private connection: Connection,
        private readonly userManager: UserUtil,
        private readonly tokenManger: TokenManager,
        private readonly fileStorageUtils: FileStorageUtils,
        private readonly repository: LearnerRepository
    ) {
    }

    async createLearner(
        data: LearnerForm,
        file: Express.Multer.File
    ): Promise<string> {
        let userId: string
        let filePath: string
        try {
            // create firebase user
            const user = await this.userManager.createFirebaseUser(data)
            // change register form to member detail
            userId = user.uid

            // set profile image path
            filePath = await this.fileStorageUtils.uploadImageTo(file, userId, "profile")

            // create entity
            const member = LearnerFormToMemberEntityMapper(data)
            member.id = userId
            member.profileUrl = filePath
            member.verified = false
            member.created = new Date()
            member.updated = new Date()

            const memberRole = new MemberRoleEntity()
            memberRole.member = member
            memberRole.role = RoleEntity.createFromId(UserRole.LEARNER)

            member.memberRole = memberRole

            // create learner profile
            const learnerProfile = new LearnerEntity()

            const contact = new ContactEntity()
            contact.phoneNumber = data.phoneNumber

            learnerProfile.id = `learner-${userId}`
            learnerProfile.contact = contact
            learnerProfile.grade = GradeEntity.createFromGrade(data.grade)
            member.leanerProfile = learnerProfile

            const balance = new CoinEntity()
            balance.member = member
            balance.amount = 1000
            balance.updated = new Date()

            // insert learner data to database
            const queryRunner = this.connection.createQueryRunner()
            try {
                await queryRunner.connect()
                await queryRunner.startTransaction()
                await queryRunner.manager.save(contact)
                await queryRunner.manager.save(member)
                await queryRunner.manager.save(balance)
                await queryRunner.commitTransaction()
            } catch (error) {
                logger.error(error)
                await queryRunner.rollbackTransaction()
                throw error
            } finally {
                await queryRunner.release()
            }

            // generate token
            const token = this.tokenManger.generateToken({
                id: member.id,
                email: member.email,
                username: member.username,
                profileUrl: member.profileUrl,
                role: UserRole.LEARNER,
                verified: false
            })

            return token
        } catch (error) {
            logger.error(error)
            if (userId) {
                await this.userManager.deleteFirebaseUser(userId)
            }
            if (filePath) {
                await this.fileStorageUtils.deleteFileFromUrl(filePath)
            }
            throw error
        }
    }

    async getProfileById(id: string): Promise<LearnerEntity> {
        try {
            return await this.connection
                .createQueryBuilder(LearnerEntity, "learner")
                .leftJoinAndSelect("learner.member", "member")
                .leftJoinAndSelect("learner.contact", "contact")
                .where("learner.id like :id")
                .setParameter("id", `learner-${id}`)
                .getOne()
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    /**
     * Get learner offline course
     * @param user
     */
    getOfflineCourse(user: User): Promise<MyCourse[]> {
        return launch(async () => {
            const courses = await this.repository.getOfflineCourse(LearnerProfile.getLearnerId(user.id))
            return isNotEmpty(courses) ? LearnerRequestToMyCourseListMapper(courses) : []
        })
    }

    /**
     * Get learner online course
     * @param user
     */
    getOnlineCourse(user: User): Promise<OnlineCourse[]> {
        return launch(async () => {
            const courses = await this.repository.getOnlineCourse(LearnerProfile.getLearnerId(user.id))
            return isNotEmpty(courses) ? new OnlineCourseEntityToOnlineCourseMapper().mapList(courses) : []
        })
    }
}
