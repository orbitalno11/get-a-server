import { Express } from "express"
import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    UploadedFile,
    UseFilters,
    UseInterceptors
} from "@nestjs/common"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { logger } from "../../../core/logging/Logger"
import SuccessResponse from "../../../core/response/SuccessResponse"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import TutorForm from "../../../model/form/register/TutorForm"
import { TutorService } from "./tutor.service"
import { FileInterceptor } from "@nestjs/platform-express"
import UploadImageUtil from "../../../utils/multer/UploadImageUtils"
import FailureResponse from "../../../core/response/FailureResponse"
import TutorRegisterFormValidator from "../../../utils/validator/register/TutorRegisterFormValidator"
import { isEmpty } from "../../../core/extension/CommonExtension"
import TutorProfile from "../../../model/profile/TutorProfile"
import { TutorEntityToTutorProfile } from "../../../utils/mapper/tutor/TutorEntityToTutorProfileMapper"
import { CurrentUser } from "../../../decorator/CurrentUser.decorator"
import { launch } from "../../../core/common/launch"
import CommonError from "../../../core/exceptions/constants/common-error.enum"
import FileError from "../../../core/exceptions/constants/file-error.enum"
import UserError from "../../../core/exceptions/constants/user-error.enum"

@Controller("v1/tutor")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class TutorController {
    constructor(private readonly tutorService: TutorService) {
    }

    @Post("create")
    @UseInterceptors(FileInterceptor("image", new UploadImageUtil().uploadImage2MbProperty("profile")))
    createTutor(@UploadedFile() file: Express.Multer.File, @Body() body: TutorForm): Promise<SuccessResponse<string>> {
        return launch(async () => {
            const data = TutorForm.createFromBody(body)
            const validator = new TutorRegisterFormValidator()
            validator.setData(data)
            const validate = validator.validate()

            if (!validate.valid) {
                logger.error("validation error")
                throw FailureResponse.create(CommonError.VALIDATE_DATA, HttpStatus.NOT_ACCEPTABLE, validate.error)
            }

            if (file === undefined || file === null) {
                logger.error("upload file is invalid:" + file)
                throw FailureResponse.create(FileError.NOT_FOUND, HttpStatus.NOT_FOUND)
            }

            const result = await this.tutorService.createTutor(data, file)

            return SuccessResponse.create(result)
        })
    }

    @Get(":id")
    getProfileById(@Param("id") id: string, @CurrentUser("id") currentUserId: string): Promise<SuccessResponse<TutorProfile | string>> {
        return launch(async () => {
            if (!id?.isSafeNotNull()) {
                logger.error("Can not found user id")
                throw FailureResponse.create(UserError.CAN_NOT_FOUND_ID, HttpStatus.NOT_FOUND)
            }

            if (id !== currentUserId) {
                logger.error("You don't have permission")
                throw FailureResponse.create(UserError.DO_NOT_HAVE_PERMISSION, HttpStatus.FORBIDDEN)
            }

            const tutorData = await this.tutorService.getProfileById(id)

            if (isEmpty(tutorData)) {
                logger.info("Can not find user")
                return SuccessResponse.create("Can not find user")
            }

            return SuccessResponse.create(new TutorEntityToTutorProfile().map(tutorData))
        })
    }
}
