import { Injectable } from "@nestjs/common"
import VerifyRepository from "../../../repository/VerifyRepository"
import { launch } from "../../../core/common/launch"
import { RequestStatus } from "../../../model/common/data/RequestStatus"
import {
    EducationHistoryToVerificationListMapper,
    EducationHistoryToVerificationMapper
} from "../../../utils/mapper/common/EducationEntityToVerification.mapper"
import EducationVerification from "../../../model/education/EducationVerification"
import {
    TestingEntityToVerificationMapper,
    TestingHistoryToVerificationListMapper
} from "../../../utils/mapper/common/TestingEntityToVerification.mapper"
import TestingVerification from "../../../model/education/TestingVerification"

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
     * Get education verification list from verification status
     * @param status
     */
    getEducationVerificationList(status: RequestStatus): Promise<EducationVerification[]> {
        return launch(async () => {
            const result = await this.repository.getEducationVerificationList(status)
            return EducationHistoryToVerificationListMapper(result)
        })
    }

    /**
     * Get education verification detail from education history id
     * @param requestId
     */
    getEducationVerificationDetail(requestId: number): Promise<EducationVerification> {
        return launch(async () => {
            const result = await this.repository.getEducationVerificationDetail(requestId)
            return EducationHistoryToVerificationMapper(result)
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
     * Get testing verification detail from testing history id
     * @param requestId
     */
    getTestingVerificationDetail(requestId: number): Promise<TestingVerification> {
        return launch( async () => {
            const result = await this.repository.getTestingVerificationDetail(requestId)
            return TestingEntityToVerificationMapper(result)
        })
    }
}