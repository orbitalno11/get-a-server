import { Controller, Get, HttpCode, Query, UseFilters, UseInterceptors } from "@nestjs/common"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { AnalyticApiService } from "./AnalyticApi.service"
import { CurrentUser } from "../../../decorator/CurrentUser.decorator"
import User from "../../../model/User"
import { isNotEmpty } from "../../../core/extension/CommonExtension"

/**
 * Controller class for "v1/analytic"
 * @author orbitalno11 2021 A.D.
 */
@Controller("v1/analytic")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
export class AnalyticApiController {
    constructor(private readonly service: AnalyticApiService) {
    }

    /**
     * Track tutor login
     * @param currentUser
     */
    @Get("login")
    @HttpCode(204)
    trackLogin(@CurrentUser() currentUser: User) {
        if (isNotEmpty(currentUser)) {
            this.service.trackLogin(currentUser)
        }
    }

    /**
     * Track tutor profile view
     * @param userId
     */
    @Get("tutor")
    @HttpCode(204)
    trackProfileView(@Query("userId") userId: string) {
        if (userId?.isSafeNotBlank()) {
            this.service.trackProfileView(userId)
        }
    }

    /**
     * Track tutor course view
     * @param userId
     */
    @Get("tutor/course")
    @HttpCode(204)
    trackTutorCourseView(@Query("userId") userId: string) {
        if (userId?.isSafeNotBlank()) {
            this.service.trackTutorCourseView(userId)
        }
    }
}