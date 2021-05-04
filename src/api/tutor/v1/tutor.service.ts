import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../../../core/logging/Logger"
import { InterestedSubjectEntity } from "../../../entity/member/interestedSubject.entity"
import { MemberRoleEntity } from "../../../entity/member/memberRole.entitiy"
import { RoleEntity } from "../../../entity/common/role.entity"
import { SubjectEntity } from "../../../entity/common/subject.entity"
import TutorForm from "../../../model/form/register/TutorForm"
import TutorFormToMemberEntityMapper from "../../../utils/mapper/tutor/TutorFormToMemberEntityMapper"
import TokenManager from "../../../utils/token/TokenManager"
import UserManager from "../../../utils/UserManager"
import { TutorEntity } from "../../../entity/profile/tutor.entity"
import { ContactEntity } from "../../../entity/contact/contact.entitiy"
import { Subject } from "../../../model/common/data/Subject"
import { FirebaseStorageUtils } from "../../../utils/files/FirebaseStorageUtils"
import {UserRole} from "../../../core/constant/UserRole"

@Injectable()
export class TutorService {
    constructor(
        private connection: Connection,
        private readonly userManager: UserManager,
        private readonly tokenManager: TokenManager
    ) {
    }

    async createTutor(data: TutorForm, file: Express.Multer.File): Promise<string> {
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
            const member = TutorFormToMemberEntityMapper(data)
            member.id = userId
            member.profileUrl = filePath
            member.created = new Date()

            const memberRole = new MemberRoleEntity()
            memberRole.member = member
            memberRole.role = RoleEntity.createFromId(UserRole.TUTOR)

            member.memberRole = memberRole

            // create update-profile profile
            const tutorProfile = new TutorEntity()

            const contact = new ContactEntity()
            contact.phoneNumber = data.phoneNumber

            tutorProfile.id = `tutor-${userId}`
            tutorProfile.contact = contact
            tutorProfile.introduction = "ยินดีที่ได้รู้จักทุกคน"
            member.tutorProfile = tutorProfile

            const subject = this.getInterestedSubjectArray(data)
            for (let index = 0; index < subject.length; index++) {
                const interestedSubjectEntity = new InterestedSubjectEntity()
                interestedSubjectEntity.subjectRank = index + 1
                interestedSubjectEntity.subject = SubjectEntity.createFromCode(subject[index])
                member.interestedSubject.push(interestedSubjectEntity)
            }

            // insert update-profile data to database
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
            const token = this.tokenManager.generateToken({
                id: member.id,
                email: member.email,
                username: member.username,
                profileUrl: member.profileUrl,
                role: UserRole.TUTOR
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

    private getInterestedSubjectArray(params: TutorForm): Array<Subject> {
        const interestedSubject = [params["subject1"]]
        const subject2 = params["subject2"]
        if (subject2?.isSafeNotNull()) {
            interestedSubject.push(subject2)
            const subject3 = params["subject3"]
            if (subject3?.isSafeNotNull()) {
                interestedSubject.push(subject3)
            }
        }
        return interestedSubject
    }

    async getProfileById(id: string): Promise<TutorEntity> {
        try {
            return await this.connection.createQueryBuilder(TutorEntity, "tutor")
                .leftJoinAndSelect("tutor.member", "member")
                .leftJoinAndSelect("tutor.contact", "contact")
                .leftJoinAndSelect("member.memberAddress", "memberAddress") // TODO map address when system can insert address
                .where("tutor.id like :id")
                .setParameter("id", `tutor-${id}`)
                .getOne()
        } catch (error) {
            logger.error(error)
            throw error
        }
    }
}
