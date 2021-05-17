import { Controller, UseFilters, UseInterceptors } from "@nestjs/common"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import { OnlineCourseService } from "./OnlineCourse.service"

@Controller("v1/online-course")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class OnlineCourseController {
    constructor(private readonly service: OnlineCourseService) {
    }
}