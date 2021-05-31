import { Injectable } from "@nestjs/common"
import SearchRepository from "../../../repository/SearchRepository"
import SearchQuery from "../../../model/search/SearchQuery"
import { launch } from "../../../core/common/launch"
import { CourseType } from "../../../model/course/data/CourseType"
import SearchResultPage from "../../../model/search/SearchResultPage"
import { OfflineCourseEntityToCardMapper } from "../../../utils/mapper/course/offline/OfflineCourseEntityToCard.mapper"

/**
 * Service class for search controller
 * @see SearchController
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class SearchService {
    constructor(private readonly repository: SearchRepository) {
    }

    /**
     * Search
     * @param query
     */
    search(query: SearchQuery): Promise<SearchResultPage> {
        return launch(async () => {
            const searchResult = new SearchResultPage()
            searchResult.currentPage = query.page
            searchResult.pageSize = query.pageSize
            if (query.type === CourseType.OFFLINE_GROUP || query.type === CourseType.OFFLINE_SINGLE) {
                // offline course search
                const result = await this.repository.searchOfflineCourse(
                    query.grade,
                    query.subject,
                    query.gender,
                    query.location,
                    query.page,
                    query.pageSize
                )
                searchResult.offlineCourse = new OfflineCourseEntityToCardMapper().mapList(result)
            } else if (query.type === CourseType.ONLINE) {
                // online course search
                return undefined
            } else {
                // all course type search
                return undefined
            }
            return searchResult
        })
    }
}