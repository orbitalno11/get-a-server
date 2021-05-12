import {
    Body,
    Controller,
    Delete,
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

/**
 * Class for controller "v1/review"
 * @author orbitalno11 2021 A.D.
 */
@Controller("v1/review")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class ReviewController {
    constructor(private readonly service: ReviewService) {
    }

    /**
     * Create course review
     * @param body
     * @param currentUser
     */
    @Post()
    createReview(@Body() body: ReviewForm, @CurrentUser() currentUser: User): Promise<IResponse<string>> {
        return launch(async () => {
            const data = ReviewForm.createFromBody(body)
            const validator = new ReviewFormValidator()
            validator.setData(data)
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
    editReview(@Body() body: ReviewForm, @CurrentUser() currentUser: User) {
        return launch(async () => {
            const data = ReviewForm.createFromBody(body)
            const validator = new ReviewFormValidator()
            validator.setData(data)
            const validate = validator.validate()

            if (!validate.valid) {
                logger.error("Invalid data")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST, validate.error)
            }

            await this.service.updateReview(body, currentUser)

            return SuccessResponse.create("Successful")
        })
    }

    /**
     * Delete course review
     * @param courseId
     * @param offlineCourse
     * @param currentUser
     */
    @Delete(":id")
    deleteReview(@Param("id") courseId: string, @Query("offline") offlineCourse: string, @CurrentUser() currentUser: User) {
        return launch(async () => {
            if (!courseId?.isSafeNotBlank() && !offlineCourse?.isSafeNotBlank() && offlineCourse?.isBoolean()) {
                logger.error("Invalid request")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }

            await this.service.deleteReview(courseId, offlineCourse === "true", currentUser)

            return SuccessResponse.create("Successful")
        })
    }
}