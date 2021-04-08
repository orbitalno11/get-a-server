import { HttpStatus, Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import FileErrorType from "../../../core/exceptions/model/FileErrorType"
import { isEmpty } from "../../../core/extension/CommonExtension"
import { logger } from "../../../core/logging/Logger"
import FailureResponse from "../../../core/response/FailureResponse"
import { InterestedSubjectEntity } from "../../../entity/member/interestedSubject.entity"
import { MemberEntity } from "../../../entity/member/member.entitiy"
import { MemberRoleEntity } from "../../../entity/member/memberRole.entitiy"
import { RoleEntity } from "../../../entity/common/role.entity"
import { SubjectEntity } from "../../../entity/common/subject.entity"
import TutorForm from "../../../model/form/register/TutorForm"
import TutorUpdateForm from "../../../model/form/update/TutorUpdateForm"
import FileManager from "../../../utils/files/FileManager"
import TutorFormToMemberEntityMapper from "../../../utils/mapper/tutor/TutorFormToMemberEntityMapper"
import TokenManager from "../../../utils/token/TokenManager"
import UserManager from "../../../utils/UserManager"
import { TutorEntity } from "../../../entity/profile/tutor.entity"
import { ContactEntity } from "../../../entity/contact/contact.entitiy"
import { UserRoleKey } from "../../../core/constant/UserRole"
import { Subject } from "../../../model/common/data/Subject"
import { FirebaseStorageUtils } from "../../../utils/files/FirebaseStorageUtils"

@Injectable()
export class TutorService {
  constructor(
    private connection: Connection,
    private readonly userManager: UserManager,
    private readonly tokenManager: TokenManager,
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
      filePath = await firebaseStorageUtils.uploadImage("profile" ,userId, file)

      // create entity
      const member = TutorFormToMemberEntityMapper(data)
      member.id = userId
      member.profileUrl = filePath
      member.created = new Date()

      const memberRole = new MemberRoleEntity()
      memberRole.member = member
      memberRole.role = RoleEntity.createFromId(UserRoleKey.TUTOR)

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
        role: UserRoleKey.TUTOR,
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

  async updateProfile(id: string, data: TutorUpdateForm, file: Express.Multer.File | null): Promise<string> {
    const firebaseStorageUtils = new FirebaseStorageUtils()
    let newFileUrl: string
    let oldFileUrl: string
    try {
      const tutorProfile = await this.getProfileById(id)
      if (isEmpty(tutorProfile)) {
        logger.error("Can not find user data")
        throw FailureResponse.create("Can not find user", HttpStatus.BAD_REQUEST)
      }

      if (file !== undefined && file !== null) {
        oldFileUrl = tutorProfile.member.profileUrl
        newFileUrl = await firebaseStorageUtils.uploadImage("profile", id, file)
        data.profileUrl = newFileUrl
      }

      // update user email if change email
      if (tutorProfile.member.email !== data.email) {
        await this.userManager.editUserEmail(id, data.email)
      }

      const contact = new ContactEntity()
      contact.id = tutorProfile.contact.id
      contact.phoneNumber = data.phoneNumber
      contact.lineId = data.lineId
      contact.facebookUrl = data.facebookUrl

      const tutorEntity = new TutorEntity()
      tutorEntity.id = `tutor-${id}`
      tutorEntity.introduction = data.introduction
      tutorEntity.contact = contact

      const member = new MemberEntity()
      member.id = id
      member.firstname = data.firstname
      member.lastname = data.lastname
      member.gender = data.gender
      member.dateOfBirth = data.dateOfBirth
      member.email = data.email
      member.username = data.username
      member.profileUrl = data.profileUrl
      member.tutorProfile = tutorEntity

      // update member data
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
        role: UserRoleKey.TUTOR,
      })

      // delete old profile image
      await firebaseStorageUtils.deleteImage(oldFileUrl)

      return token
    } catch (error) {
      logger.error(error)
      if (newFileUrl) {
        await firebaseStorageUtils.deleteImage(newFileUrl)
      }
      throw error
    }
  }
}
