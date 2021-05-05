import { Controller, Get, HttpStatus, Post, Query, UploadedFiles, UseFilters, UseInterceptors } from "@nestjs/common"
import { VerifyService } from "./verify.service"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import UploadImageUtils from "../../../utils/multer/UploadImageUtils"
import { launch } from "../../../core/common/launch"
import FailureResponse from "../../../core/response/FailureResponse"
import CommonError from "../../../core/exceptions/constants/common-error.enum"
import { logger } from "../../../core/logging/Logger"
import SuccessResponse from "../../../core/response/SuccessResponse"
import IResponse from "../../../core/response/IResponse"

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
}