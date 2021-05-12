import { Body, Controller, Post, UseFilters, UseInterceptors } from "@nestjs/common"
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
     * @param user
     */
    @Post()
    createReview(@Body() body: ReviewForm, @CurrentUser() user: User): Promise<IResponse<string>> {
        return launch(async () => {
            await this.service.createReview(body, user)
            return SuccessResponse.create("Successful")
        })
    }
}