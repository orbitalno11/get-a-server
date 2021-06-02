import { Injectable } from "@nestjs/common"
import SearchRepository from "../../../repository/SearchRepository"
import SearchQuery from "../../../model/search/SearchQuery"
import { launch } from "../../../core/common/launch"
import { CourseType } from "../../../model/course/data/CourseType"
import SearchResultPage from "../../../model/search/SearchResultPage"
import { OfflineCourseEntityToCardMapper } from "../../../utils/mapper/course/offline/OfflineCourseEntityToCard.mapper"
import { OnlineCourseToCourseCardMapper } from "../../../utils/mapper/course/online/OnlineCourseToCourseCard.mapper"
import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate"
import { Grade } from "../../../model/common/data/Grade"
import { Subject } from "../../../model/common/data/Subject"
import SearchResult from "../../../model/search/SearchResult"
import OfflineCourseCard from "../../../model/course/OfflineCourseCard"
import { Gender } from "../../../model/common/data/Gender"
import OnlineCourseCard from "../../../model/course/OnlineCourseCard"

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
            if (query.type === CourseType.OFFLINE_GROUP || query.type === CourseType.OFFLINE_SINGLE) {
                // offline course search
                searchResult.offlineCourse = await this.searchOfflineCourse(query)

                if (query.location) {
                    searchResult.nearby = await this.searchOfflineCourse(query)
                }
            } else if (query.type === CourseType.ONLINE) {
                // online course search
                searchResult.onlineCourse = await this.searchOnlineCourse(query)
            } else {
                // all course type search
                searchResult.offlineCourse = await this.searchOfflineCourse(query)

                if (query.location) {
                    searchResult.nearby = await this.searchOfflineCourse(query)
                }

                searchResult.onlineCourse = await this.searchOnlineCourse(query)
            }
            return searchResult
        })
    }

    /**
     * Search offline course
     * @param query
     * @private
     */
    private searchOfflineCourse(query: SearchQuery): Promise<SearchResult<OfflineCourseCard>> {
        return launch(async () => {
            const paginationOptions = this.createPaginationOption(query)

            let result
            if (!query.location) {
                result = await this.repository.searchOfflineCourse(
                    query.grade,
                    query.subject,
                    query.gender,
                    paginationOptions
                )
            } else {
                result = await this.repository.searchOfflineCourse(
                    query.grade,
                    query.subject,
                    query.gender,
                    paginationOptions,
                    query.location
                )
            }

            const offlineCourse = this.createSearchResult<OfflineCourseCard>(result)
            offlineCourse.item = new OfflineCourseEntityToCardMapper().mapList(result.items)

            return offlineCourse
        })
    }

    /**
     * Search online course
     * @param query
     * @private
     */
    private searchOnlineCourse(query: SearchQuery): Promise<SearchResult<OnlineCourseCard>> {
        return launch(async () => {
            const paginationOptions = this.createPaginationOption(query)

            const result = await this.repository.searchOnlineCourse(
                query.grade,
                query.subject,
                query.gender,
                paginationOptions
            )

            const onlineCourse = this.createSearchResult<OnlineCourseCard>(result)
            onlineCourse.item = new OnlineCourseToCourseCardMapper().mapList(result.items)

            return onlineCourse
        })
    }

    /**
     * Create query parameter
     * @param url
     * @param query
     * @private
     */
    private queryBuilder(url: string, query: SearchQuery): string {
        let queryString = ""
        for (const key of Object.keys(query)) {
            if (key === "page" || key === "limit") {
                continue
            }
            if (key === "grade" && query[key] === Grade.NOT_SPECIFIC) {
                continue
            }
            if (key === "subject" && query[key] === Subject.NOT_SPECIFIC) {
                continue
            }
            if (key === "gender" && query[key] === Gender.NOT_SPECIFIC) {
                continue
            }
            queryString = queryString.concat(key)
            queryString = queryString.concat(`=${query[key]}&`)
        }
        queryString = queryString.slice(0,-1)
        return `${url}?${queryString}`
    }

    /**
     * Create pagination option
     * @param query
     * @private
     */
    private createPaginationOption(query: SearchQuery): IPaginationOptions {
        return {
            page: query.page,
            limit: query.limit,
            route: this.queryBuilder("search", query)
        }
    }

    /**
     * Create search result
     * @param pagination
     * @private
     */
    private createSearchResult<T>(pagination: Pagination<any>): SearchResult<T> {
        const searchResult = new SearchResult<T>()
        searchResult.links = pagination.links
        searchResult.meta = pagination.meta
        return searchResult
    }
}