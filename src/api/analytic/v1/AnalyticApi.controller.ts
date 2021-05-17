import { Controller, UseFilters, UseInterceptors } from "@nestjs/common"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import { AnalyticApiService } from "./AnalyticApi.service"

/**
 * Controller class for "v1/analytic"
 * @author orbitalno11 2021 A.D.
 */
@Controller("v1/analytic")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class AnalyticApiController {
    constructor(private readonly service: AnalyticApiService) {
    }
}