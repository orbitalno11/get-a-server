import MyCourse from "../course/MyCourse"
import OnlineCourseCard from "../course/OnlineCourseCard"
import { ApiProperty } from "@nestjs/swagger"
import OfflineCourseCard from "../course/OfflineCourseCard"

class SearchResultPage {
    @ApiProperty() currentPage: number
    @ApiProperty() pageSize: number
    @ApiProperty() offlineCourse: Array<OfflineCourseCard>
    @ApiProperty() onlineCourse: Array<OnlineCourseCard>
    @ApiProperty() nearby: Array<MyCourse>
}

export default SearchResultPage