import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../core/logging/Logger"
import { EducationHistoryEntity } from "../entity/education/educationHistory.entity"
import { RequestStatus } from "../model/common/data/RequestStatus"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { VerificationError } from "../core/exceptions/constants/verification-error.enum"
import { TestingHistoryEntity } from "../entity/education/testingHistory.entity"
import { UserVerifyEntity } from "../entity/UserVerify.entity"
import { UserVerify } from "../model/common/data/UserVerify.enum"

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

    /**
     * Approved testing verification
     * @param requestId
     */
    async approvedTesting(requestId: string) {
        try {
            await this.connection.getRepository(TestingHistoryEntity).save({
                id: requestId.toNumber(),
                verified: RequestStatus.APPROVE
            })
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not approved verification", VerificationError.CAN_NOT_APPROVE)
        }
    }

    /**
     * Denied testing verification
     * @param requestId
     */
    async deniedTesting(requestId: string) {
        try {
            await this.connection.getRepository(TestingHistoryEntity).save({
                id: requestId.toNumber(),
                verified: RequestStatus.DENIED
            })
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not denied verification", VerificationError.CAN_NOT_DENIED)
        }
    }

    /**
     * Get education verification list from verification status
     * @param status
     */
    async getEducationVerificationList(status: RequestStatus): Promise<UserVerifyEntity[]> {
        try {
            return await this.connection.createQueryBuilder(UserVerifyEntity, "verify")
                .leftJoinAndSelect("verify.member", "member")
                .leftJoinAndSelect("verify.educationHistory", "education")
                .where("education.verified = :status", { "status": status })
                .orderBy("verify.updated", "DESC")
                .getMany()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get verification list", VerificationError.CAN_NOT_GET_VERIFICATION_LIST)
        }
    }

    /**
     * Get education verification detail from request id
     * @param requestId
     */
    async getEducationVerificationDetail(requestId: string): Promise<UserVerifyEntity> {
        try {
            return await this.connection.createQueryBuilder(UserVerifyEntity, "verify")
                .leftJoinAndSelect("verify.member", "member")
                .leftJoinAndSelect("verify.educationHistory", "education")
                .leftJoinAndSelect("education.institute", "institute")
                .leftJoinAndSelect("education.branch", "branch")
                .where("verify.id = :requestId", { "requestId": requestId})
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get verification detail", VerificationError.CAN_NOT_GET_VERIFICATION_DETAIL)
        }
    }

    /**
     * Get testing verification list from verification status
     * @param status
     */
    async getTestingVerificationList(status: RequestStatus): Promise<UserVerifyEntity[]> {
        try {
            return await this.connection.createQueryBuilder(UserVerifyEntity, "verify")
                .leftJoinAndSelect("verify.member", "member")
                .leftJoinAndSelect("verify.testingHistory", "testing")
                .leftJoinAndSelect("testing.subject", "subject")
                .leftJoinAndSelect("testing.exam", "exam")
                .where("testing.verified = :status", { "status": status })
                .orderBy("verify.updated", "DESC")
                .getMany()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get verification list", VerificationError.CAN_NOT_GET_VERIFICATION_LIST)
        }
    }

    /**
     * Get testing verification detail from request id
     * @param requestId
     */
    async getTestingVerificationDetail(requestId: string): Promise<UserVerifyEntity> {
        try {
            return await this.connection.createQueryBuilder(UserVerifyEntity, "verify")
                .leftJoinAndSelect("verify.member", "member")
                .leftJoinAndSelect("verify.testingHistory", "testing")
                .leftJoinAndSelect("testing.subject", "subject")
                .leftJoinAndSelect("testing.exam", "exam")
                .where("verify.id like :requestId", {"requestId": requestId})
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get verification detail", VerificationError.CAN_NOT_GET_VERIFICATION_DETAIL)
        }
    }

    /**
     * Get identity verification list from verification status
     * @param status
     */
    async getIdentityVerificationList(status: RequestStatus): Promise<UserVerifyEntity[]> {
        try {
            return await this.connection.createQueryBuilder(UserVerifyEntity, "verify")
                .leftJoinAndSelect("verify.member", "member")
                .where("member.verified = :status", { "status": status })
                .andWhere("verify.type = :type", { "type": UserVerify.IDENTITY })
                .orderBy("verify.updated", "DESC")
                .getMany()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get verification list", VerificationError.CAN_NOT_GET_VERIFICATION_LIST)
        }
    }

    /**
     * Get identity verification list from user verify request id
     * @param requestId
     */
    async getIdentityVerificationDetail(requestId: string): Promise<UserVerifyEntity> {
        try {
            return await this.connection.createQueryBuilder(UserVerifyEntity, "verify")
                .leftJoinAndSelect("verify.member", "member")
                .where("verify.id like :requestId", { "requestId": requestId })
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get verification detail", VerificationError.CAN_NOT_GET_VERIFICATION_DETAIL)
        }
    }
}

export default VerifyRepository