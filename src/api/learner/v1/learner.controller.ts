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
import { FileInterceptor } from "@nestjs/platform-express"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { logger } from "../../../core/logging/Logger"
import FailureResponse from "../../../core/response/FailureResponse"
import SuccessResponse from "../../../core/response/SuccessResponse"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import LearnerForm from "../../../model/form/register/LearnerForm"
import LearnerRegisterFromValidator from "../../../utils/validator/register/LearnerRegisterFormValidator"
import { LearnerService } from "./learner.service"
import { isEmpty } from "../../../core/extension/CommonExtension"
import { launch } from "../../../core/common/launch"
import CommonError from "../../../core/exceptions/constants/common-error.enum"
import FileError from "../../../core/exceptions/constants/file-error.enum"
import UserError from "../../../core/exceptions/constants/user-error.enum"
import SimpleProfile from "../../../model/profile/SimpleProfile"
import { LearnerEntityToSimpleProfile } from "../../../utils/mapper/learner/LearnerEntityToPublicProfile.mapper"
import { UploadFileUtils } from "../../../utils/multer/UploadFileUtils"
import { CurrentUser } from "../../../decorator/CurrentUser.decorator"
import User from "../../../model/User"
import IResponse from "../../../core/response/IResponse"
import MyCourse from "../../../model/course/MyCourse"
import { UserRole } from "../../../core/constant/UserRole"
import OnlineCourse from "../../../model/course/OnlineCourse"
import { ApiTags } from "@nestjs/swagger"

@ApiTags("learner")
@Controller("v1/learner")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class LearnerController {
    constructor(private readonly learnerService: LearnerService) {
    }

    @Post("create")
    @UseInterceptors(
        FileInterceptor(
            "image",
            new UploadFileUtils().uploadImage2MbProperty()
        )
    )
    createLearner(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: LearnerForm
    ): Promise<SuccessResponse<string>> {
        return launch(async () => {
            const data = LearnerForm.createFromBody(body)
            const validator = new LearnerRegisterFromValidator()
            validator.setData(data)
            const validate = validator.validate()

            if (!validate.valid) {
                logger.error("validation error")
                throw FailureResponse.create(
                    CommonError.VALIDATE_DATA,
                    HttpStatus.BAD_REQUEST,
                    validate.error
                )
            }

            if (file === undefined || file === null) {
                logger.error("upload file is invalid:" + file)
                throw FailureResponse.create(
                    FileError.NOT_FOUND,
                    HttpStatus.NOT_FOUND
                )
            }

            const result = await this.learnerService.createLearner(data, file)
            return SuccessResponse.create(result)
        })
    }

    /**
     * Get learner offline course
     * @param currentUser
     */
    @Get("offline-course")
    getOfflineCourse(@CurrentUser() currentUser: User): Promise<IResponse<MyCourse[]>> {
        return launch(async () => {
            if (currentUser.role !== UserRole.LEARNER) {
                logger.error("Do not have a permission")
                throw FailureResponse.create(UserError.DO_NOT_HAVE_PERMISSION)
            }

            const courses = await this.learnerService.getOfflineCourse(currentUser)

            return SuccessResponse.create(courses)
        })
    }

    /**
     * Get learner online course
     * @param currentUser
     */
    @Get("online-course")
    getOnlineCourse(@CurrentUser() currentUser: User): Promise<IResponse<OnlineCourse[]>> {
        return launch(async () => {
            if (currentUser.role !== UserRole.LEARNER) {
                logger.error("Do not have a permission")
                throw FailureResponse.create(UserError.DO_NOT_HAVE_PERMISSION)
            }

            const courses = await this.learnerService.getOnlineCourse(currentUser)

            return SuccessResponse.create(courses)
        })
    }

    @Get(":id")
    getProfileById(@Param("id") id: string): Promise<SuccessResponse<SimpleProfile | string>> {
        return launch(async () => {
            if (!id.isSafeNotNull()) {
                logger.error("Can not found user id")
                throw FailureResponse.create(
                    UserError.CAN_NOT_FOUND_ID,
                    HttpStatus.NOT_FOUND
                )
            }

            const learnerData = await this.learnerService.getProfileById(id)

            if (isEmpty(learnerData)) {
                logger.info("Can not find user")
                return SuccessResponse.create(UserError.CAN_NOT_FIND)
            }

            return SuccessResponse.create(LearnerEntityToSimpleProfile(learnerData))
        })
    }
}
