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
import UserManager from "../../../utils/UserManager"
import { FirebaseStorageUtils } from "../../../utils/files/FirebaseStorageUtils"

@Injectable()
export class LearnerService {
    constructor(
        private connection: Connection,
        private readonly userManager: UserManager,
        private readonly tokenManger: TokenManager
    ) {
    }

    async createLearner(
        data: LearnerForm,
        file: Express.Multer.File
    ): Promise<string> {
        const firebaseStorageUtils = new FirebaseStorageUtils()
        let userId: string
        let filePath: string
        try {
            // create firebase user
            const user = await this.userManager.createUser(data)
            // change register form to member detail
            userId = user.uid

            // set profile image path
            filePath = await firebaseStorageUtils.uploadImage("profile", userId, file)

            // create entity
            const member = LearnerFormToMemberEntityMapper(data)
            member.id = userId
            member.profileUrl = filePath
            member.created = new Date()

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

            // insert learner data to database
            const queryRunner = this.connection.createQueryRunner()
            try {
                await queryRunner.connect()
                await queryRunner.startTransaction()
                await queryRunner.manager.save(contact)
                await queryRunner.manager.save(member)
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
                role: UserRole.LEARNER
            })

            return token
        } catch (error) {
            logger.error(error)
            if (userId) {
                await this.userManager.deleteUser(userId)
            }
            if (filePath) {
                await firebaseStorageUtils.deleteImage(filePath)
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
}
