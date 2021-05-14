import { Controller, UseFilters, UseInterceptors } from "@nestjs/common"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import { FavoriteService } from "./favorite.service"

/**
 * Controller for "v1/favorite"
 * @author orbitalno11 2021 A.D.
 */
@Controller("v1/favorite")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class FavoriteController {
    constructor(private readonly service: FavoriteService) {
    }
}