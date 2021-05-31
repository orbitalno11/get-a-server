import { Controller, Get, Query, UseFilters, UseInterceptors } from "@nestjs/common"
import { SearchService } from "./Search.service"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import SearchQuery from "../../../model/search/SearchQuery"
import IResponse from "../../../core/response/IResponse"
import { launch } from "../../../core/common/launch"
import SuccessResponse from "../../../core/response/SuccessResponse"
import SearchResultPage from "../../../model/search/SearchResultPage"
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger"

/**
 * Controller class for "v1/search"
 * @author orbitalno11 2021 A.D.
 */
@ApiTags("search")
@Controller("v1/search")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class SearchController {
    constructor(private readonly service: SearchService) {
    }

    /**
     * Search API
     * @param searchQuery
     */
    @Get()
    @ApiQuery({ type: SearchQuery })
    @ApiOkResponse({ description: "Search result", type: SearchResultPage })
    @ApiInternalServerErrorResponse({ description: "Can not get course" })
    search(@Query() searchQuery: SearchQuery): Promise<IResponse<SearchResultPage>> {
        return launch(async () => {
            const queryData = SearchQuery.createFromQuery(searchQuery)
            const searchResult = await this.service.search(queryData)
            return SuccessResponse.create(searchResult)
        })
    }
}