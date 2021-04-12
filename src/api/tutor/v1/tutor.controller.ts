import {Express} from "express"
import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    UploadedFile,
    UseFilters,
    UseInterceptors
} from "@nestjs/common"
import {ErrorExceptionFilter} from "../../../core/exceptions/filters/ErrorException.filter"
import {FailureResponseExceptionFilter} from "../../../core/exceptions/filters/FailureResponseException.filter"
import {logger} from "../../../core/logging/Logger"
import SuccessResponse from "../../../core/response/SuccessResponse"
import {TransformSuccessResponse} from "../../../interceptors/TransformSuccessResponse.interceptor"
import TutorForm from "../../../model/form/register/TutorForm"
import {TutorService} from "./tutor.service"
import {FileInterceptor} from "@nestjs/platform-express"
import UploadImageUtil from "../../../utils/multer/UploadImageUtils"
import FailureResponse from "../../../core/response/FailureResponse"
import TutorRegisterFormValidator from "../../../utils/validator/register/TutorRegisterFormValidator"
import {isEmpty} from "../../../core/extension/CommonExtension"
import TutorUpdateForm from "../../../model/form/update/TutorUpdateForm"
import TutorUpdateFormValidator from "../../../utils/validator/update-profile/TutorUpdateFormValidator"
import TutorProfile from "../../../model/profile/TutorProfile"
import {TutorEntityToTutorProfile} from "../../../utils/mapper/tutor/TutorEntityToTutorProfileMapper"
import {CurrentUser} from "../../../decorator/CurrentUser.decorator"

@Controller("v1/tutor")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class TutorController {
    constructor(private readonly tutorService: TutorService) {
    }

    @Post("create")
    @UseInterceptors(FileInterceptor("image", new UploadImageUtil().uploadImage2MbProperty("profile")))
    async createTutor(@UploadedFile() file: Express.Multer.File, @Body() body: TutorForm): Promise<SuccessResponse<string>> {
        try {
            const data = TutorForm.createFromBody(body)
            const validator = new TutorRegisterFormValidator()
            validator.setData(data)
            const validate = validator.validate()

            if (!validate.valid) {
                logger.error("validation error")
                throw FailureResponse.create("Register data is invalid", HttpStatus.NOT_ACCEPTABLE, validate.error)
            }

            if (file === undefined || file === null) {
                logger.error("upload file is invalid:" + file)
                throw FailureResponse.create("Please upload image file", HttpStatus.NOT_FOUND)
            }

            const result = await this.tutorService.createTutor(data, file)

            return SuccessResponse.create(result)
        } catch (error) {
            logger.error(error)
            if (error instanceof FailureResponse) throw error
            throw FailureResponse.create(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get(":id")
    async getProfileById(@Param("id") id: string, @CurrentUser("id") currentUserId: string): Promise<SuccessResponse<TutorProfile | string>> {
        try {
            if (!id?.isSafeNotNull()) {
                logger.error("Can not found user id")
                throw FailureResponse.create("Can not found user id", HttpStatus.NOT_FOUND)
            }

            if (id !== currentUserId) {
                logger.error("You don't have permission")
                throw FailureResponse.create("You don't have permission", HttpStatus.UNAUTHORIZED)
            }

            const tutorData = await this.tutorService.getProfileById(id)

            if (isEmpty(tutorData)) {
                logger.info("Can not find user")
                return SuccessResponse.create("Can not find user")
            }

            return SuccessResponse.create(new TutorEntityToTutorProfile().map(tutorData))
        } catch (error) {
            logger.error(error)
            if (error instanceof FailureResponse) throw error
            throw FailureResponse.create(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Put(":id")
    @UseInterceptors(FileInterceptor("image", new UploadImageUtil().uploadImage2MbProperty("profile")))
    async updateProfile(
        @Param("id") id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: TutorUpdateForm,
        @CurrentUser("id") currentUserId: string
    ): Promise<SuccessResponse<string>> {
        try {
            if (!id.isSafeNotNull()) {
                logger.error("Can not found user id")
                throw FailureResponse.create("Can not found user id", HttpStatus.NOT_FOUND)
            }

            if (id !== currentUserId) {
                logger.error("You don't have permission")
                throw FailureResponse.create("You don't have permission", HttpStatus.UNAUTHORIZED)
            }

            const data = TutorUpdateForm.createFromBody(body)
            const validator = new TutorUpdateFormValidator()
            validator.setData(data)
            const validate = validator.validate()

            if (!validate.valid) {
                logger.error("validation error")
                throw FailureResponse.create("Update data is invalid", HttpStatus.NOT_ACCEPTABLE, validate.error)
            }

            const resut = await this.tutorService.updateProfile(id, data, file)
            return SuccessResponse.create(resut)
        } catch (error) {
            logger.error(error)
            if (error instanceof FailureResponse) throw error
            throw FailureResponse.create(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
