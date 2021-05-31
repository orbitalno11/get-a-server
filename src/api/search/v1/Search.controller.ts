import { Controller, Get, UseFilters, UseInterceptors } from "@nestjs/common"
import { SearchService } from "./Search.service"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"

/**
 * Controller class for "v1/search"
 * @author orbitalno11 2021 A.D.
 */
@Controller("v1/search")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class SearchController {
    constructor(private readonly service: SearchService) {
    }

    @Get()
    search() {

    }
}