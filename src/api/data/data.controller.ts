import { Controller, UseFilters, UseInterceptors } from "@nestjs/common"
import { DataService } from "./data.service"
import { FailureResponseExceptionFilter } from "../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../core/exceptions/filters/ErrorException.filter"
import { TransformSuccessResponse } from "../../interceptors/TransformSuccessResponse.interceptor"

/**
 * Controller class for "_data" api
 * @author orbitalno11 2020 A.D.
 */
@Controller("_data")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class DataController {
    constructor(private readonly service: DataService) {
    }
}