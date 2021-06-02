import OnlineCourseCard from "../course/OnlineCourseCard"
import { ApiProperty } from "@nestjs/swagger"
import OfflineCourseCard from "../course/OfflineCourseCard"
import SearchResult from "./SearchResult"

class SearchResultPage {
    @ApiProperty() offlineCourse: SearchResult<OfflineCourseCard>
    @ApiProperty() onlineCourse: SearchResult<OnlineCourseCard>
    @ApiProperty() nearby: SearchResult<OfflineCourseCard>
}

export default SearchResultPage