import { Injectable } from "@nestjs/common"
import VerifyRepository from "../../../repository/VerifyRepository"
import { launch } from "../../../core/common/launch"
import { RequestStatus } from "../../../model/common/data/RequestStatus"
import {
    UserVerifyToEducationListMapper,
    UserVerifyToEducationMapper
} from "../../../utils/mapper/verify/UserVerifyToEducation.mapper"
import EducationVerification from "../../../model/education/EducationVerification"
import {
    UserVerifyToTestingMapper,
    TestingHistoryToVerificationListMapper
} from "../../../utils/mapper/verify/UserVerifyToTesting.mapper"
import TestingVerification from "../../../model/education/TestingVerification"
import {
    UserVerifyToIdentityVerificationMapper,
    UserVerifyToVerificationListMapper
} from "../../../utils/mapper/verify/UserVerifyToIdentityVerification.mapper"
import IdentityVerification from "../../../model/verify/IdentityVerification"

/**
 * Service class for "v1/verify"
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class VerifyService {
    constructor(private readonly repository: VerifyRepository) {
    }

    /**
     * Approved education verification
     * @param requestId
     */
    approvedEducation(requestId: string) {
        return launch(async () => {
            await this.repository.approvedEducation(requestId)
        })
    }

    /**
     * Denied education verification
     * @param requestId
     */
    deniedEducation(requestId: string) {
        return launch(async () => {
            await this.repository.deniedEducation(requestId)
        })
    }

    /**
     * Approved testing verification
     * @param requestId
     */
    approvedTesting(requestId: string) {
        return launch(async () => {
            await this.repository.approvedTesting(requestId)
        })
    }

    /**
     * Denied testing verification
     * @param requestId
     */
    deniedTesting(requestId: string) {
        return launch(async () => {
            await this.repository.deniedTesting(requestId)
        })
    }

    /**
     * Approved identity verification
     * @param requestId
     */
    approveIdentity(requestId: string) {
        return launch(async() => {
            await this.repository.approvedIdentity(requestId)
        })
    }

    /**
     * Denied identity verification
     * @param requestId
     */
    deniedIdentity(requestId: string) {
        return launch(async () => {
            await this.repository.deniedIdentity(requestId)
        })
    }

    /**
     * Get education verification list from verification status
     * @param status
     */
    getEducationVerificationList(status: RequestStatus): Promise<EducationVerification[]> {
        return launch(async () => {
            const result = await this.repository.getEducationVerificationList(status)
            return UserVerifyToEducationListMapper(result)
        })
    }

    /**
     * Get education verification detail from request id
     * @param requestId
     */
    getEducationVerificationDetail(requestId: string): Promise<EducationVerification> {
        return launch(async () => {
            const result = await this.repository.getEducationVerificationDetail(requestId)
            return UserVerifyToEducationMapper(result)
        })
    }

    /**
     * Get testing verification list from verification status
     * @param status
     */
    getTestingVerificationList(status: RequestStatus): Promise<TestingVerification[]> {
        return launch(async () => {
            const result = await this.repository.getTestingVerificationList(status)
            return TestingHistoryToVerificationListMapper(result)
        })
    }

    /**
     * Get testing verification detail from request id
     * @param requestId
     */
    getTestingVerificationDetail(requestId: string): Promise<TestingVerification> {
        return launch(async () => {
            const result = await this.repository.getTestingVerificationDetail(requestId)
            return UserVerifyToTestingMapper(result)
        })
    }

    /**
     * Get identity verification list from verification status
     * @param status
     */
    getIdentityVerificationList(status: RequestStatus): Promise<IdentityVerification[]> {
        return launch(async () => {
            const result = await this.repository.getIdentityVerificationList(status)
            return UserVerifyToVerificationListMapper(result)
        })
    }

    /**
     * Get identity verification list from user verify request id
     * @param requestId
     */
    getIdentityVerificationDetail(requestId: string): Promise<IdentityVerification> {
        return launch(async () => {
            const result = await this.repository.getIdentityVerificationDetail(requestId)
            return UserVerifyToIdentityVerificationMapper(result)
        })
    }
}