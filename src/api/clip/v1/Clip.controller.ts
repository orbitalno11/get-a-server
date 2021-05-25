import {
    Body,
    Controller,
    HttpStatus,
    Post,
    UploadedFile,
    UseFilters,
    UseInterceptors
} from "@nestjs/common"
import { ClipService } from "./Clip.service"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import { FileInterceptor } from "@nestjs/platform-express"
import { UploadFileUtils } from "../../../utils/multer/UploadFileUtils"
import ClipForm from "../../../model/clip/ClipForm"
import { launch } from "../../../core/common/launch"
import ClipFormValidator from "../../../utils/validator/clip/ClipFormValidator"
import { logger } from "../../../core/logging/Logger"
import FailureResponse from "../../../core/response/FailureResponse"
import CommonError from "../../../core/exceptions/constants/common-error.enum"
import { isEmpty } from "../../../core/extension/CommonExtension"
import { CurrentUser } from "../../../decorator/CurrentUser.decorator"
import User from "../../../model/User"
import SuccessResponse from "../../../core/response/SuccessResponse"

/**
 * Controller class for "v1/clip" API
 * @author orbitalno11 2021 A.D.
 */
@Controller("v1/clip")
@UseFilters(ErrorExceptionFilter, FailureResponseExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class ClipController {
    constructor(private readonly service: ClipService) {
    }

    @Post("create")
    @UseInterceptors(FileInterceptor("video", new UploadFileUtils().uploadHdVideo()))
    createClip(
        @Body() body: ClipForm,
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() currentUser: User
    ) {
        return launch(async () => {
            const validator = new ClipFormValidator(body)
            const { valid, error } = validator.validate()

            if (!valid) {
                logger.error("Invalid request data")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST, error)
            }

            if (isEmpty(file)) {
                logger.error("Invalid video")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST, "Video is not found")
            }

            const clipId = await this.service.createClip(body, file, currentUser)

            return SuccessResponse.create(clipId)
        })
    }
}