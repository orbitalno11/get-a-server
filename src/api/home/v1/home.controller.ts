import { Controller, Get, Query, UseFilters, UseInterceptors } from "@nestjs/common"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import { HomeService } from "./home.service"
import IResponse from "../../../core/response/IResponse"
import TutorCard from "../../../model/profile/TutorCard"
import { launch } from "../../../core/common/launch"
import SuccessResponse from "../../../core/response/SuccessResponse"
import { ApiTags } from "@nestjs/swagger"
import OnlineCourseCard from "../../../model/course/OnlineCourseCard"

/**
 * Controller class for "v1/home" API
 * @author orbitalno11 2021 A.D.
 */
@ApiTags("home")
@Controller("v1/home")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class HomeController {
    constructor(private readonly service: HomeService) {
    }

    /**
     * Get tutor list by rank
     * @param rankLimit
     */
    @Get("tutor/ranking")
    getTutorListByRank(@Query("rank") rankLimit: string): Promise<IResponse<TutorCard[]>> {
        return launch(async () => {
            const limit = rankLimit?.isNumber() ? rankLimit.toNumber() : null
            const tutorList = await this.service.getTutorListByRank(limit)
            return SuccessResponse.create(tutorList)
        })
    }

    /**
     * Get online course by rank
     * @param rankLimit
     */
    @Get("online/ranking")
    getOnlineCourseByRank(@Query("rank") rankLimit: string): Promise<IResponse<OnlineCourseCard[]>> {
        return launch(async () => {
            const limit = rankLimit?.isNumber() ? rankLimit.toNumber() : null
            const courseList = await this.service.getOnlineCourseListByRank(limit)
            return SuccessResponse.create(courseList)
        })
    }
}