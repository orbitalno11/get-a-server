import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseFilters,
    UseInterceptors
} from "@nestjs/common"
import { OfflineCourseService } from "./OfflineCourse.service"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import OfflineCourseForm from "../../../model/course/OfflineCourseForm"
import { logger } from "../../../core/logging/Logger"
import FailureResponse from "../../../core/response/FailureResponse"
import OfflineCourseFormValidator from "../../../utils/validator/offline-course/OfflineCourseFormValidator"
import SuccessResponse from "../../../core/response/SuccessResponse"
import { CurrentUser } from "../../../decorator/CurrentUser.decorator"
import OfflineCourse from "../../../model/course/OfflineCourse"
import { OfflineCourseEntityToOfflineCourseMapper } from "../../../utils/mapper/course/offline/OfflineCourseEntityToOfflineCourseMapper"
import { EnrollListMapper } from "../../../utils/mapper/course/offline/EnrollListMapper"
import IResponse from "../../../core/response/IResponse"
import { launch } from "../../../core/common/launch"
import CommonError from "../../../core/exceptions/constants/common-error.enum"
import { CourseError } from "../../../core/exceptions/constants/course-error.enum"
import UserError from "../../../core/exceptions/constants/user-error.enum"
import User from "../../../model/User"
import OfflineCourseEnroll from "../../../model/course/OfflineCourseEnroll"

// TODO Refactor this class to use repository
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
     * Check current user id is valid
     * @param userId
     * @private
     */
    private checkCurrentUser(userId?: string) {
        if (!userId?.isSafeNotNull()) {
            logger.error("user is invalid")
            throw FailureResponse.create(UserError.CAN_NOT_FIND, HttpStatus.BAD_REQUEST)
        }
    }

    /**
     * Check received course id is valid
     * @param courseId
     * @private
     */
    private checkCourseId(courseId?: string) {
        if (!courseId?.isSafeNotNull()) {
            logger.error("Can not found course id")
            throw FailureResponse.create(UserError.CAN_NOT_FIND, HttpStatus.NOT_FOUND)
        }
    }

    /**
     * Create am offline course
     * @param currentUserId
     * @param body
     */
    @Post("create")
    createOfflineCourse(@CurrentUser("id") currentUserId: string, @Body() body: OfflineCourseForm): Promise<IResponse<string>> {
        return launch(async () => {
            this.checkCurrentUser(currentUserId)

            const data = OfflineCourseForm.createFromBody(body)
            const validator = new OfflineCourseFormValidator()
            validator.setData(data)
            const validate = validator.validate()

            if (!validate.valid) {
                logger.error("data is invalid")
                throw FailureResponse.create(CommonError.VALIDATE_DATA, HttpStatus.BAD_REQUEST, validate.error)
            }

            const courseId = await this.service.createOfflineCourse(currentUserId, data)

            return SuccessResponse.create(courseId)
        })
    }

    /**
     * Get an offline course data, if the user request is a course owner or not
     * @param courseId
     * @param currentUser
     */
    @Get(":id")
    getOfflineCourseDetail(@Param("id") courseId: string, @CurrentUser() currentUser?: User): Promise<IResponse<OfflineCourse>> {
        return launch(async () => {
            if (!courseId?.isSafeNotBlank()) {
                logger.error("Invalid request data")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }

            const course = await this.service.getOfflineCourseDetail(courseId, currentUser)
            return SuccessResponse.create(course)
        })
    }

    /**
     * Update an offline course data by checking user id for that request is an owner
     * @param courseId
     * @param currentUserId
     * @param body
     */
    @Put("/:id")
    updateOfflineCourse(
        @Param("id") courseId: string,
        @CurrentUser("id") currentUserId: string,
        @Body() body: OfflineCourseForm): Promise<IResponse<OfflineCourse>> {
        return launch(async () => {
            this.checkCourseId(courseId)
            this.checkCurrentUser(currentUserId)

            const data = OfflineCourseForm.createFromBody(body)
            const validator = new OfflineCourseFormValidator()
            validator.setData(data)
            const validate = validator.validate()

            if (!validate.valid) {
                logger.error("data is invalid")
                throw FailureResponse.create(CommonError.VALIDATE_DATA, HttpStatus.BAD_REQUEST, validate.error)
            }

            const isOwner = await this.service.checkCourseOwner(courseId, currentUserId)
            if (!isOwner) {
                logger.error("You are not a course owner.")
                throw FailureResponse.create(CourseError.CAN_NOT_UPDATE, HttpStatus.BAD_REQUEST)
            }

            const updatedCourseData = await this.service.updateOfflineCourse(courseId, currentUserId, data)
            const offlineCourseData = new OfflineCourseEntityToOfflineCourseMapper().map(updatedCourseData)
            return SuccessResponse.create(offlineCourseData)
        })
    }

    /**
     * Enroll an offline course for a learner
     * @param courseId
     * @param currentUserId
     */
    @Post(":id/enroll")
    learnerRequestOfflineCourse(@Param("id") courseId: string, @CurrentUser("id") currentUserId: string): Promise<SuccessResponse<string>> {
        return launch(async () => {
            this.checkCourseId(courseId)
            this.checkCurrentUser(currentUserId)

            const availableCourse = await this.service.checkOfflineCourseAvailable(courseId)

            const result = await this.service.enrollOfflineCourse(availableCourse, currentUserId)

            return SuccessResponse.create(result)
        })
    }

    /**
     * Get learner enroll list
     * @param courseId
     * @param currentUser
     */
    @Get(":id/enroll")
    getEnrollList(@Param("id") courseId: string, @CurrentUser() currentUser: User): Promise<IResponse<OfflineCourseEnroll[]>> {
        return launch(async () => {
            this.checkCourseId(courseId)
            const enrollList = await this.service.getEnrollOfflineCourseList(courseId, currentUser)
            return SuccessResponse.create(enrollList)
        })
    }

    /**
     * Tutor manage a learner enroll course request
     * @param courseId
     * @param currentUserId
     * @param learnerId
     * @param action - param for manage action "approve" or "denied"
     */
    @Get(":id/accept")
    manageEnrollRequest(
        @Param("id") courseId: string,
        @CurrentUser("id") currentUserId: string,
        @Query("learnerId") learnerId: string,
        @Query("action") action: string
    ): Promise<IResponse<string>> {
        return launch(async () => {
            this.checkCourseId(courseId)
            this.checkCurrentUser(currentUserId)

            if (!learnerId?.isSafeNotNull()) {
                logger.error("Can not found learner id")
                throw FailureResponse.create(CourseError.CAN_NOT_FOUND_LEARNER, HttpStatus.NOT_FOUND)
            }

            const availableCourse = await this.service.checkOfflineCourseAvailable(courseId)
            const isOwner = await this.service.checkCourseOwner(courseId, currentUserId)
            if (!isOwner) {
                logger.error("You are not a course owner.")
                throw FailureResponse.create(UserError.DO_NOT_HAVE_PERMISSION, HttpStatus.BAD_REQUEST)
            }

            const result = await this.service.manageEnrollRequest(availableCourse, currentUserId, learnerId, action)

            return SuccessResponse.create(result)
        })
    }
}
