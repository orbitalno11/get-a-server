import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseFilters,
    UseInterceptors
} from "@nestjs/common"
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
import {EnrollListMapper} from "../../../utils/mapper/course/offline/EnrollListMapper";

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
            throw FailureResponse.create("Can not found user", HttpStatus.BAD_REQUEST)
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
            throw FailureResponse.create("Can not found course id", HttpStatus.NOT_FOUND)
        }
    }

    /**
     * Create am offline course
     * @param currentUserId
     * @param body
     */
    @Post("create")
    async createOfflineCourse(@CurrentUser("id") currentUserId: string, @Body() body: OfflineCourseForm): Promise<IResponse<string>> {
        try {
            this.checkCurrentUser(currentUserId)

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
    @Get(":id")
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
            this.checkCourseId(courseId)
            this.checkCurrentUser(currentUserId)

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

    /**
     * Enroll an offline course for a learner
     * @param courseId
     * @param currentUserId
     */
    @Post(":id/enroll")
    async learnerRequestOfflineCourse(@Param("id") courseId: string, @CurrentUser("id") currentUserId: string): Promise<SuccessResponse<string>> {
        try {
            this.checkCourseId(courseId)
            this.checkCurrentUser(currentUserId)

            const availableCourse = await this.service.checkOfflineCourseAvailable(courseId)

            const result = await this.service.enrollOfflineCourse(availableCourse, currentUserId)

            return SuccessResponse.create(result)
        } catch (error) {
            logger.error(error)
            if (error instanceof FailureResponse) throw error
            throw FailureResponse.create(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    /**
     * Get learner enroll list
     * @param courseId
     * @param currentUserId
     */
    @Get(":id/enroll")
    async getEnrollList(@Param("id") courseId: string, @CurrentUser("id") currentUserId: string) {
        try {
            this.checkCourseId(courseId)
            this.checkCurrentUser(currentUserId)

            const isOwner = await this.service.checkCourseOwner(courseId, currentUserId)
            if (!isOwner) {
                logger.error("You are not a course owner.")
                throw FailureResponse.create("You are not a course owner.", HttpStatus.BAD_REQUEST)
            }

            const result = await this.service.getEnrollOfflineCourseList(courseId)
            const enrollList = new EnrollListMapper().map(result)

            return SuccessResponse.create(enrollList)
        } catch (error) {
            logger.error(error)
            if (error instanceof FailureResponse) throw error
            throw FailureResponse.create(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    /**
     * Tutor manage a learner enroll course request
     * @param courseId
     * @param currentUserId
     * @param learnerId
     * @param action - param for manage action "approve" or "denied"
     */
    @Get(":id/accept")
    async menageEnrollRequest(
        @Param("id") courseId: string,
        @CurrentUser("id") currentUserId: string,
        @Query("learnerId") learnerId: string,
        @Query("action") action: string
    ): Promise<IResponse<string>> {
        try {
            this.checkCourseId(courseId)
            this.checkCurrentUser(currentUserId)

            if (!learnerId?.isSafeNotNull()) {
                logger.error("Can not found learner id")
                throw FailureResponse.create("Can not found learner id", HttpStatus.NOT_FOUND)
            }

            const availableCourse = await this.service.checkOfflineCourseAvailable(courseId)
            const isOwner = await this.service.checkCourseOwner(courseId, currentUserId)
            if (!isOwner) {
                logger.error("You are not a course owner.")
                throw FailureResponse.create("You are not a course owner.", HttpStatus.BAD_REQUEST)
            }

            const result = await this.service.manageEnrollRequest(availableCourse, currentUserId, learnerId, action)

            return SuccessResponse.create(result)
        } catch (error) {
            logger.error(error)
            if (error instanceof FailureResponse) throw error
            throw FailureResponse.create(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
