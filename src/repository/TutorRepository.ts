import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../core/logging/Logger"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { TutorError } from "../core/exceptions/constants/tutor-error.enum"
import EducationVerifyForm from "../model/education/EducationVerifyForm"
import User from "../model/User"
import { EducationHistoryEntity } from "../entity/education/educationHistory.entity"
import { TutorEntity } from "../entity/profile/tutor.entity"
import TutorProfile from "../model/profile/TutorProfile"
import { BranchEntity } from "../entity/education/branch.entity"
import { InstituteEntity } from "../entity/education/institute.entity"
import { UserVerifyEntity } from "../entity/UserVerify.entity"
import { MemberEntity } from "../entity/member/member.entitiy"
import { UserVerify } from "../model/common/data/UserVerify.enum"
import { RequestStatus } from "../model/common/data/RequestStatus"

@Injectable()
class TutorRepository {
    constructor(private readonly connection: Connection) {
    }

    async requestEducationVerify(requestId: string, user: User, data: EducationVerifyForm, fileUrl: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const tutor = new TutorEntity()
            tutor.id = TutorProfile.getTutorId(user.id)

            const member = new MemberEntity()
            member.id = user.id

            const branch = new BranchEntity()
            branch.id = data.branch

            const institute = new InstituteEntity()
            institute.id = data.institute

            const educationHistory = new EducationHistoryEntity()
            educationHistory.tutor = tutor
            educationHistory.branch = branch
            educationHistory.institute = institute
            educationHistory.gpax = data.gpax
            educationHistory.status = data.status
            educationHistory.verified = RequestStatus.WAITING

            const userVerify = new UserVerifyEntity()
            userVerify.id = requestId
            userVerify.member = member
            userVerify.documentUrl1 = fileUrl
            userVerify.type = UserVerify.EDUCATION

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(educationHistory)
            await queryRunner.manager.save(userVerify)
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not request education verification", TutorError.CAN_NOT_REQUEST_EDUCATION_VERIFY)
        } finally {
            await queryRunner.release()
        }
    }
}

export default TutorRepository