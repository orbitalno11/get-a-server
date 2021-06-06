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
import IResponse from "../../../core/response/IResponse"
import OnlineCourse from "../../../model/course/OnlineCourse"
import OnlineCourseNameList from "../../../model/course/OnlineCourseNameList"
import { UserRole } from "../../../core/constant/UserRole"
import UserError from "../../../core/exceptions/constants/user-error.enum"
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import ClipDetail from "../../../model/clip/ClipDetail"

/**
 * Controller class for "v1/online-course"
 * @author orbitalno11 2021 A.D.
 */
@ApiTags("online-course")
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
    @UseInterceptors(FileInterceptor("image", new UploadFileUtils().uploadImageA4Vertical()))
    createOnlineCourse(
        @Body() body: OnlineCourseForm,
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() currentUser: User
    ) {
        return launch(async () => {
            if (!currentUser.verified) {
                throw FailureResponse.create(UserError.NOT_VERIFIED, HttpStatus.FORBIDDEN)
            }

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

    /**
     * Tutor get own course name list
     * Get
     * @param currentUser
     */
    @Get("list")
    getOnlineCourseNameList(@CurrentUser() currentUser: User): Promise<IResponse<OnlineCourseNameList[]>> {
        return launch(async () => {
            if (currentUser?.role !== UserRole.TUTOR) {
                throw FailureResponse.create(UserError.DO_NOT_HAVE_PERMISSION, HttpStatus.FORBIDDEN)
            }

            const result = await this.service.getOnlineCourseNameList(currentUser)
            return SuccessResponse.create(result)
        })
    }


    /**
     * Get Online course by id
     * @param courseId
     */
    @Get(":id")
    getOnlineCourseDetailById(@Param("id") courseId: string): Promise<IResponse<OnlineCourse>> {
        return launch(async () => {
            if (!courseId?.isSafeNotBlank()) {
                logger.error("course id is invalid")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }
            const course = await this.service.getOnlineCourseById(courseId)
            return SuccessResponse.create(course)
        })
    }

    /**
     * Update online course
     * @param courseId
     * @param body
     * @param file
     * @param currentUser
     */
    @Put(":id")
    @UseInterceptors(FileInterceptor("image", new UploadFileUtils().uploadImageA4Vertical()))
    updateOnlineCourse(
        @Param("id") courseId: string,
        @Body() body: OnlineCourseForm,
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() currentUser: User
    ): Promise<IResponse<string>> {
        return launch(async () => {
            if (!courseId?.isSafeNotBlank()) {
                logger.error("Invalid course id")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }

            const data = OnlineCourseForm.createFromBody(body)
            const validator = new OnlineCourseFormValidator(data)
            const { valid, error } = validator.validate()

            if (!valid) {
                logger.error("Invalid request data")
                throw FailureResponse.create(CommonError.VALIDATE_DATA, HttpStatus.BAD_REQUEST, error)
            }

            const result = await this.service.updateOnlineCourse(courseId, data, currentUser, file)

            return SuccessResponse.create(result)
        })
    }

    /**
     * Get clip list in course by course id
     * @param courseId
     * @param currentUser
     */
    @Get(":id/clip")
    @ApiOkResponse({ description: "list of clip detail", type: ClipDetail, isArray: true })
    @ApiBadRequestResponse({ description: "Invalid course id" })
    @ApiInternalServerErrorResponse({ description: "Can not get clip in course"})
    getClipInOnlineCourse(@Param("id") courseId: string, @CurrentUser() currentUser: User) {
        return launch(async () => {
            if (!courseId?.isSafeNotBlank()) {
                logger.error("Invalid course id")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }

            const clips = await this.service.getClipInOnlineCourse(courseId, currentUser)

            return SuccessResponse.create(clips)
        })
    }
}