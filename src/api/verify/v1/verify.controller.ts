import { Controller, Get, HttpStatus, Param, Query, UseFilters, UseInterceptors } from "@nestjs/common"
import { VerifyService } from "./verify.service"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import { launch } from "../../../core/common/launch"
import FailureResponse from "../../../core/response/FailureResponse"
import CommonError from "../../../core/exceptions/constants/common-error.enum"
import { logger } from "../../../core/logging/Logger"
import SuccessResponse from "../../../core/response/SuccessResponse"
import IResponse from "../../../core/response/IResponse"
import { RequestStatus } from "../../../model/common/data/RequestStatus"
import EducationVerification from "../../../model/education/EducationVerification"
import TestingVerification from "../../../model/education/TestingVerification"
import IdentityVerification from "../../../model/verify/IdentityVerification"

/**
 * Controller class for "v1/verify"
 * @author oribitalno11 2021 A.D.
 */
@Controller("v1/verify")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class VerifyController {
    constructor(private readonly service: VerifyService) {
    }

    /**
     * Manage education verification
     * @param id
     * @param approved
     */
    @Get("education")
    manageEducationVerification(@Query("id") id: string, @Query("approved") approved: string): Promise<IResponse<string>> {
        return launch(async () => {
            if (id?.isSafeNotBlank() && approved?.isSafeNotBlank()) {
                switch (approved) {
                    case "true": {
                        await this.service.approvedEducation(id)
                        break
                    }
                    case "false": {
                        await this.service.deniedEducation(id)
                        break
                    }
                    default: {
                        logger.error("Invalid approve key.")
                        throw FailureResponse.create(CommonError.INVALID, HttpStatus.BAD_REQUEST)
                    }
                }
                return SuccessResponse.create("Successful")
            } else {
                logger.error("Invalid approve data.")
                throw FailureResponse.create(CommonError.INVALID, HttpStatus.BAD_REQUEST)
            }
        })
    }

    /**
     * Get education verification detail from request id
     * @param requestId
     */
    @Get("education/:id")
    getEducationVerificationDetail(@Param("id") requestId: string): Promise<IResponse<EducationVerification>> {
        return launch(async () => {
            if (requestId?.isSafeNotBlank()) {
                const result = await this.service.getEducationVerificationDetail(requestId)
                return SuccessResponse.create(result)
            } else {
                throw FailureResponse.create(CommonError.INVALID, HttpStatus.BAD_REQUEST)
            }
        })
    }

    /**
     * Get education verification list from verification status
     * @param status
     */
    @Get("educations")
    getEducationVerificationList(@Query("status") status: RequestStatus): Promise<IResponse<EducationVerification[]>> {
        return launch(async () => {
            const result = await this.service.getEducationVerificationList(status ? status : RequestStatus.WAITING)
            return SuccessResponse.create(result)
        })
    }

    /**
     * Manage testing verification
     * @param id
     * @param approved
     */
    @Get("testing")
    manageTestingVerification(@Query("id") id: string, @Query("approved") approved: string): Promise<IResponse<string>> {
        return launch(async () => {
            if (id?.isSafeNotBlank() && approved?.isSafeNotBlank()) {
                switch (approved) {
                    case "true": {
                        await this.service.approvedTesting(id)
                        break
                    }
                    case "false": {
                        await this.service.deniedTesting(id)
                        break
                    }
                    default: {
                        logger.error("Invalid approve key.")
                        throw FailureResponse.create(CommonError.INVALID, HttpStatus.BAD_REQUEST)
                    }
                }
                return SuccessResponse.create("Successful")
            } else {
                logger.error("Invalid approve data.")
                throw FailureResponse.create(CommonError.INVALID, HttpStatus.BAD_REQUEST)
            }
        })
    }

    /**
     * Get testing verification detail from request id
     * @param requestId
     */
    @Get("testing/:id")
    getTestingVerificationDetail(@Param("id") requestId: string): Promise<IResponse<TestingVerification>> {
        return launch(async () => {
            if (requestId?.isSafeNotBlank()) {
                const result = await this.service.getTestingVerificationDetail(requestId)
                return SuccessResponse.create(result)
            } else {
                throw FailureResponse.create(CommonError.INVALID, HttpStatus.BAD_REQUEST)
            }
        })
    }

    /**
     * Get testing verification list from verification status
     * @param status
     */
    @Get("testings")
    getTestingVerificationList(@Query("status") status: RequestStatus): Promise<IResponse<TestingVerification[]>> {
        return launch(async () => {
            const result = await this.service.getTestingVerificationList(status ? status : RequestStatus.WAITING)
            return SuccessResponse.create(result)
        })
    }

    /**
     * Get identity verification list from verification status
     * @param status
     */
    @Get("identities")
    getIdentityVerificationList(@Query("status") status: RequestStatus): Promise<IResponse<IdentityVerification[]>> {
        return launch(async () => {
            const result = await this.service.getIdentityVerificationList(status ? status : RequestStatus.WAITING)
            return SuccessResponse.create(result)
        })
    }

    /**
     * Manage identity verification
     * @param id
     * @param approved
     */
    @Get("identity")
    manageIdentityVerification(@Query("id") id: string, @Query("approved") approved: string) {
        return launch(async () => {
            if (id?.isSafeNotBlank() && approved?.isSafeNotBlank()) {
                switch (approved) {
                    case "true": {
                        await this.service.approveIdentity(id)
                        break
                    }
                    case "false": {
                        await this.service.deniedIdentity(id)
                        break
                    }
                    default: {
                        logger.error("Invalid approve key.")
                        throw FailureResponse.create(CommonError.INVALID, HttpStatus.BAD_REQUEST)
                    }
                }
                return SuccessResponse.create("Successful")
            } else {
                logger.error("Invalid approve data.")
                throw FailureResponse.create(CommonError.INVALID, HttpStatus.BAD_REQUEST)
            }
        })
    }

    /**
     * Get identity verification list from user verify request id
     * @param requestId
     */
    @Get("identity/:id")
    getIdentityVerificationData(@Param("id") requestId: string) {
        return launch(async () => {
            if (requestId?.isSafeNotBlank()) {
                const result = await this.service.getIdentityVerificationDetail(requestId)
                return SuccessResponse.create(result)
            } else {
                throw FailureResponse.create(CommonError.INVALID, HttpStatus.BAD_REQUEST)
            }
        })
    }
}