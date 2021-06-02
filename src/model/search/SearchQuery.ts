import { Gender } from "../common/data/Gender"
import { Grade } from "../common/data/Grade"
import { Subject } from "../common/data/Subject"
import { ApiProperty } from "@nestjs/swagger"

class SearchQuery {
    @ApiProperty({ required: false }) grade?: number
    @ApiProperty({ required: false }) subject?: string
    @ApiProperty({ required: false }) gender?: number
    @ApiProperty({ required: false }) type?: number
    @ApiProperty({ required: false }) location?: string
    @ApiProperty({ required: false }) page?: number
    @ApiProperty({ required: false }) limit?: number

    public static createFromQuery(data: SearchQuery): SearchQuery {
        const query = new SearchQuery()
        if (data.grade?.toString()?.isNumber() && Number(data.grade)?.isSafeNumber()) {
            query.grade = Number(data.grade)
        } else {
            query.grade = Grade.NOT_SPECIFIC
        }
        if (data.subject?.isSafeNotBlank()) {
            query.subject = data.subject
        } else {
            query.subject = Subject.NOT_SPECIFIC
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
        if (data.limit?.toString()?.isNumber() && Number(data.limit)?.isSafeNumber()) {
            query.limit = Number(data.limit)
        } else {
            query.limit = 20
        }
        return query
    }
}

export default SearchQuery