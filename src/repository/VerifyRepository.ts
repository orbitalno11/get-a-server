import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../core/logging/Logger"
import { EducationHistoryEntity } from "../entity/education/educationHistory.entity"
import { RequestStatus } from "../model/common/data/RequestStatus"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { VerificationError } from "../core/exceptions/constants/verification-error.enum"

/**
 * Repository for "v1/verify"
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class VerifyRepository {
    constructor(private readonly connection: Connection) {
    }

    /**
     * Approved education verification
     * @param requestId
     */
    async approvedEducation(requestId: string) {
        try {
            await this.connection.getRepository(EducationHistoryEntity).save({
                id: requestId.toNumber(),
                verified: RequestStatus.APPROVE
            })
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not approved verification", VerificationError.CAN_NOT_APPROVE)
        }
    }

    /**
     * Denied education verification
     * @param requestId
     */
    async deniedEducation(requestId: string) {
        try {
            await this.connection.getRepository(EducationHistoryEntity).save({
                id: requestId.toNumber(),
                verified: RequestStatus.DENIED
            })
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not denied verification", VerificationError.CAN_NOT_DENIED)
        }
    }
}

export default VerifyRepository