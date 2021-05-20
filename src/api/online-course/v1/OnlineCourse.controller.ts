import { Body, Controller, HttpStatus, Post, UploadedFile, UseFilters, UseInterceptors } from "@nestjs/common"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import { OnlineCourseService } from "./OnlineCourse.service"
import OnlineCourseForm from "../../../model/course/OnlineCourseForm"
import { CurrentUser } from "../../../decorator/CurrentUser.decorator"
import User from "../../../model/User"
import { launch } from "../../../core/common/launch"
import SuccessResponse from "../../../core/response/SuccessResponse"
import { FileInterceptor } from "@nestjs/platform-express"
import { UploadFileUtils } from "../../../utils/multer/UploadFileUtils"
import OnlineCourseFormValidator from "../../../utils/validator/online-course/OnlineCourseFormValidator"
import { logger } from "../../../core/logging/Logger"
import FailureResponse from "../../../core/response/FailureResponse"
import CommonError from "../../../core/exceptions/constants/common-error.enum"
import { isEmpty } from "../../../core/extension/CommonExtension"

/**
 * Controller class for "v1/online-course"
 * @author orbitalno11 2021 A.D.
 */
@Controller("v1/online-course")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class OnlineCourseController {
    constructor(private readonly service: OnlineCourseService) {
    }

    /**
     * Create online course
     * @param body
     * @param file
     * @param currentUser
     */
    @Post("create")
    @UseInterceptors(FileInterceptor("image", new UploadFileUtils().uploadImage2MbProperty()))
    createOnlineCourse(
        @Body() body: OnlineCourseForm,
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() currentUser: User
    ) {
        return launch(async () => {
            const data = OnlineCourseForm.createFromBody(body)
            const validator = new OnlineCourseFormValidator(data)
            const { valid, error } = validator.validate()

            if (!valid) {
                logger.error("Invalid request data")
                throw FailureResponse.create(CommonError.VALIDATE_DATA, HttpStatus.BAD_REQUEST, error)
            }

            if (isEmpty(file)) {
                logger.error("Invalid request data")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST, "Course photo is missing")
            }

            const courseId = await this.service.createOnlineCourse(data, file, currentUser)

            return SuccessResponse.create(courseId)
        })
    }
}