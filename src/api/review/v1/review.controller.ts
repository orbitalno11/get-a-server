import {
    Body,
    Controller,
    Delete, Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseFilters,
    UseInterceptors
} from "@nestjs/common"
import { ReviewService } from "./review.service"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import ReviewForm from "../../../model/review/ReviewForm"
import { CurrentUser } from "../../../decorator/CurrentUser.decorator"
import User from "../../../model/User"
import { launch } from "../../../core/common/launch"
import IResponse from "../../../core/response/IResponse"
import SuccessResponse from "../../../core/response/SuccessResponse"
import ReviewFormValidator from "../../../utils/validator/review/ReviewFormValidator"
import { logger } from "../../../core/logging/Logger"
import FailureResponse from "../../../core/response/FailureResponse"
import CommonError from "../../../core/exceptions/constants/common-error.enum"
import Review from "../../../model/review/Review"
import { CourseType } from "../../../model/course/data/CourseType"
import { ApiTags } from "@nestjs/swagger"

/**
 * Class for controller "v1/review"
 * @author orbitalno11 2021 A.D.
 */
@ApiTags("review")
@Controller("v1/review")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class ReviewController {
    constructor(private readonly service: ReviewService) {
    }

    /**
     * Create course and clip review
     * @param body
     * @param currentUser
     */
    @Post()
    createReview(@Body() body: ReviewForm, @CurrentUser() currentUser: User): Promise<IResponse<string>> {
        return launch(async () => {
            const data = ReviewForm.createFromBody(body)
            const validator = new ReviewFormValidator(data)
            const validate = validator.validate()

            if (!validate.valid) {
                logger.error("Invalid data")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST, validate.error)
            }

            await this.service.createReview(body, currentUser)

            return SuccessResponse.create("Successful")
        })
    }

    /**
     * Update course review
     * @param body
     * @param currentUser
     */
    @Put()
    editReview(@Body() body: ReviewForm, @CurrentUser() currentUser: User): Promise<IResponse<string>> {
        return launch(async () => {
            const data = ReviewForm.createFromBody(body)
            const validator = new ReviewFormValidator(data)
            const validate = validator.validate()

            if (!validate.valid || !data.reviewId?.isPositiveValue()) {
                logger.error("Invalid data")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST, validate.error)
            }

            await this.service.updateReview(body, currentUser)

            return SuccessResponse.create("Successful")
        })
    }

    /**
     * Get course review
     * @param courseId
     * @param courseType
     * @param currentUser
     */
    @Get("course/:id")
    getCourseReview(
        @Param("id") courseId: string,
        @Query("type") courseType: string,
        @CurrentUser() currentUser: User
    ): Promise<IResponse<Review[]>> {
        return launch(async () => {
            if (!courseId?.isSafeNotBlank() || !courseType?.isSafeNotBlank() || !this.isCourseType(courseType)) {
                logger.error("Invalid request")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }

            const reviews = await this.service.getCourseReview(courseId, courseType.toNumber(), currentUser)

            return SuccessResponse.create(reviews)
        })
    }

    /**
     * Delete course review
     * @param courseId
     * @param courseType
     * @param reviewId
     * @param currentUser
     */
    @Delete(":id")
    deleteReview(
        @Param("id") reviewId: string,
        @Query("type") courseType: string,
        @Query("course") courseId: string,
        @CurrentUser() currentUser: User
    ) {
        return launch(async () => {
            if (!reviewId?.isSafeNotBlank() ||
                !reviewId?.toNumber()?.isPositiveValue() ||
                !courseId?.isSafeNotBlank() ||
                !courseType?.isSafeNotBlank() ||
                !this.isCourseType(courseType)
            ) {
                logger.error("Invalid request")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }

            await this.service.deleteReview(reviewId.toNumber(), courseId, courseType.toNumber(), currentUser)

            return SuccessResponse.create("Successful")
        })
    }

    /**
     * Get user course review by review id
     * @param reviewId
     * @param courseType
     */
    @Get(":id")
    getCourseReviewById(
        @Param("id") reviewId: string,
        @Query("type") courseType: string
    ): Promise<IResponse<Review>> {
        return launch(async () => {
            if (!reviewId?.isSafeNotBlank() || !reviewId?.isSafeNotBlank() || !courseType?.isSafeNotBlank() || !this.isCourseType(courseType)) {
                logger.error("Invalid request")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }

            const review = await this.service.getReviewById(reviewId.toNumber(), courseType.toNumber())

            return SuccessResponse.create(review)
        })
    }

    /**
     * Check course type
     * @param courseType
     * @private
     */
    private isCourseType(courseType: string): boolean {
        const type = courseType.toNumber()
        return type in CourseType
    }
}