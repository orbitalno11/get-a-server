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
import { MemberEntity } from "../entity/member/member.entitiy"

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
            const verification = await this.getUserVerificationDetail(requestId)
            await this.connection.createQueryBuilder()
                .update(EducationHistoryEntity)
                .set({
                    verified: RequestStatus.APPROVE
                })
                .where("verified_id like :requestId", { "requestId": verification.id })
                .execute()
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
            const verification = await this.getUserVerificationDetail(requestId)
            await this.connection.createQueryBuilder()
                .update(EducationHistoryEntity)
                .set({
                    verified: RequestStatus.DENIED
                })
                .where("verified_id like :requestId", { "requestId": verification.id })
                .execute()
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
            const verification = await this.getUserVerificationDetail(requestId)
            await this.connection.createQueryBuilder()
                .update(TestingHistoryEntity)
                .set({
                    verified: RequestStatus.APPROVE
                })
                .where("verified_id like :requestId", { "requestId": verification.id })
                .execute()
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
            const verification = await this.getUserVerificationDetail(requestId)
            await this.connection.createQueryBuilder()
                .update(TestingHistoryEntity)
                .set({
                    verified: RequestStatus.DENIED
                })
                .where("verified_id like :requestId", { "requestId": verification.id })
                .execute()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not denied verification", VerificationError.CAN_NOT_DENIED)
        }
    }

    /**
     * Approved identity verification
     * @param requestId
     */
    async approvedIdentity(requestId: string) {
        try {
            const verificationData = await this.getUserVerificationDetail(requestId)

            await this.connection.createQueryBuilder()
                .update(MemberEntity)
                .set({
                    verified: true
                })
                .where("id like :userId", { "userId": verificationData.member?.id })
                .execute()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not approved verification", VerificationError.CAN_NOT_APPROVE)
        }
    }

    /**
     * Denied identity verification
     * @param requestId
     */
    async deniedIdentity(requestId: string) {
        try {
            const verificationData = await this.getUserVerificationDetail(requestId)

            await this.connection.createQueryBuilder()
                .update(MemberEntity)
                .set({
                    verified: false
                })
                .where("id like :userId", { "userId": verificationData.member?.id })
                .execute()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not approved verification", VerificationError.CAN_NOT_APPROVE)
        }
    }

    /**
     * Get user verification detail
     * @param requestId
     * @private
     */
    private async getUserVerificationDetail(requestId: string): Promise<UserVerifyEntity> {
        try {
            const verificationData = await this.connection.getRepository(UserVerifyEntity).findOne({
                where: {
                    id: requestId
                },
                join: {
                    alias: "verify",
                    leftJoinAndSelect: {
                        member: "verify.member"
                    }
                }
            })

            if (!verificationData) {
                logger.error("Can not found verification data", VerificationError.CAN_NOT_GET_VERIFICATION_DETAIL)
                throw ErrorExceptions.create("Can not found verification data", VerificationError.CAN_NOT_GET_VERIFICATION_DETAIL)
            }

            return verificationData
        } catch (error) {
            logger.error(error)
            if (error instanceof ErrorExceptions) throw error
            throw ErrorExceptions.create("Can not found verification data", VerificationError.CAN_NOT_GET_VERIFICATION_DETAIL)
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
                .andWhere("verify.type = :type", { "type": UserVerify.EDUCATION })
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
                .where("verify.id = :requestId", { "requestId": requestId })
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
                .andWhere("verify.type = :type", { "type": UserVerify.TESTING_RESULT })
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
                .where("verify.id like :requestId", { "requestId": requestId })
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