import { Controller, Post, UploadedFiles, UseFilters, UseInterceptors } from "@nestjs/common"
import { VerifyService } from "./verify.service"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import UploadImageUtils from "../../../utils/multer/UploadImageUtils"

/**
 * Controller class for "v1/verify"
 * @author oribitalno11 2021 A.D.
 */
@Controller("v1/verify")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class TutorVerifyController {
    constructor(private readonly service: VerifyService) {
    }

    @Post("profile")
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: "idCard", maxCount: 1 },
            { name: "face", maxCount: 1 },
            { name: "idCardWithFace", maxCount: 1 }
        ], new UploadImageUtils().uploadImage2MbProperty())
    )
    createProfileVerifyRequest(
        @UploadedFiles() files
    ) {

    }

}