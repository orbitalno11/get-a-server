import { Gender } from "../common/data/Gender"

class SearchQuery {
    grade?: number
    subject?: string
    gender?: number
    type?: number
    location?: string
    page?: number
    pageSize?: number

    public static createFromQuery(data: SearchQuery): SearchQuery {
        const query = new SearchQuery()
        if (data.grade?.toString()?.isNumber() && Number(data.grade)?.isSafeNumber()) {
            query.grade = Number(data.grade)
        }
        if (data.subject?.isSafeNotBlank()) {
            query.subject = data.subject
        }
        if (data.gender?.toString()?.isNumber() && Number(data.gender)?.isSafeNumber()) {
            query.gender = Number(data.gender)
        } else {
            query.gender = Gender.NOT_SPECIFIC
        }
        if (data.type?.toString()?.isNumber() && Number(data.type)?.isSafeNumber()) {
            query.type = Number(data.type)
        }
        if (data.location?.isSafeNotBlank()) {
            query.location = data.location
        }
        if (data.page?.toString()?.isNumber() && Number(data.page)?.isSafeNumber()) {
            query.page = Number(data.page)
        } else {
            query.page = 1
        }
        if (data.pageSize?.toString()?.isNumber() && Number(data.pageSize)?.isSafeNumber()) {
            query.pageSize = Number(data.pageSize)
        } else {
            query.pageSize = 20
        }
        return query
    }
}

export default SearchQuery