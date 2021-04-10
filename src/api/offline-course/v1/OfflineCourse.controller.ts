import {Body, Controller, Get, HttpStatus, Param, Post, Put, Req, UseFilters, UseInterceptors} from "@nestjs/common"
import {OfflineCourseService} from "./OfflineCourse.service"
import {FailureResponseExceptionFilter} from "../../../core/exceptions/filters/FailureResponseException.filter"
import {ErrorExceptionFilter} from "../../../core/exceptions/filters/ErrorException.filter"
import {TransformSuccessResponse} from "../../../interceptors/TransformSuccessResponse.interceptor"
import OfflineCourseForm from "../../../model/course/OfflineCourseForm"
import {logger} from "../../../core/logging/Logger"
import FailureResponse from "../../../core/response/FailureResponse"
import OfflineCourseFormValidator from "../../../utils/validator/offline-course/OfflineCourseFormValidator"
import SuccessResponse from "../../../core/response/SuccessResponse"
import {CurrentUser} from "../../../decorator/CurrentUser.decorator";
import OfflineCourse from "../../../model/course/OfflineCourse";
import {OfflineCourseEntityToOfflineCourseMapper} from "../../../utils/mapper/course/offline/OfflineCourseEntityToOfflineCourseMapper";
import IResponse from "../../../core/response/IResponse";

/**
 * Controller for offline course
 * @author oribitalno11 2021 A.D.
 */
@Controller("v1/offline-course")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class OfflineCourseController {
    constructor(private readonly service: OfflineCourseService) {
    }

    /**
     * Create am offline course
     * @param currentUserId
     * @param body
     */
    @Post("create")
    async createOfflineCourse(@CurrentUser("id") currentUserId: string, @Body() body: OfflineCourseForm): Promise<IResponse<string>> {
        try {
            if (!currentUserId?.isSafeNotNull()) {
                logger.error("user is invalid")
                throw FailureResponse.create("Can not found user", HttpStatus.BAD_REQUEST)
            }

            const data = OfflineCourseForm.createFromBody(body)
            const validator = new OfflineCourseFormValidator()
            validator.setData(data)
            const validate = validator.validate()

            if (!validate.valid) {
                logger.error("data is invalid")
                throw FailureResponse.create("Course data is invalid", HttpStatus.BAD_REQUEST, validate.error)
            }

            const courseId = await this.service.createOfflineCourse(currentUserId, data)

            return SuccessResponse.create(courseId)
        } catch (error) {
            logger.error(error)
            if (error instanceof FailureResponse) throw error
            throw FailureResponse.create(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    /**
     * Get an offline course data, if the user request is a course owner or not
     * @param courseId
     * @param currentUserId
     */
    @Get("/:id")
    async getOfflineCourseDetail(@Param("id") courseId: string, @CurrentUser("id") currentUserId?: string): Promise<IResponse<OfflineCourse>> {
        try {
            const courseData = await this.service.getOfflineCourseDetail(courseId)
            const data = new OfflineCourseEntityToOfflineCourseMapper(currentUserId === courseData.owner.member.id).map(courseData)
            return SuccessResponse.create(data)
        } catch (error) {
            logger.error(error)
            if (error instanceof FailureResponse) throw error
            throw FailureResponse.create(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    /**
     * Update an offline course data by checking user id for that request is an owner
     * @param courseId
     * @param currentUserId
     * @param body
     */
    @Put("/:id")
    async updateOfflineCourse(
        @Param("id") courseId: string,
        @CurrentUser("id") currentUserId: string,
        @Body() body: OfflineCourseForm): Promise<IResponse<OfflineCourse>> {
        try {
            if (!courseId?.isSafeNotNull()) {
                logger.error("Can not found course id")
                throw FailureResponse.create("Can not found course id", HttpStatus.NOT_FOUND)
            }

            if (!currentUserId?.isSafeNotNull()) {
                logger.error("user is invalid")
                throw FailureResponse.create("Can not found user", HttpStatus.NOT_FOUND)
            }

            const data = OfflineCourseForm.createFromBody(body)
            const validator = new OfflineCourseFormValidator()
            validator.setData(data)
            const validate = validator.validate()

            if (!validate.valid) {
                logger.error("data is invalid")
                throw FailureResponse.create("Course data is invalid", HttpStatus.BAD_REQUEST, validate.error)
            }

            const isOwner = await this.service.checkCourseOwner(courseId, currentUserId)
            if (!isOwner) {
                logger.error("You are not a course owner.")
                throw FailureResponse.create("You are not a course owner.", HttpStatus.BAD_REQUEST)
            }

            const updatedCourseData = await this.service.updateOfflineCourse(courseId, currentUserId, data)
            const offlineCourseData = new OfflineCourseEntityToOfflineCourseMapper(isOwner).map(updatedCourseData)
            return SuccessResponse.create(offlineCourseData)
        } catch (error) {
            logger.error(error)
            if (error instanceof FailureResponse) throw error
            throw FailureResponse.create(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
