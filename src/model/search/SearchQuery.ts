import { Grade } from "../common/data/Grade"
import { Subject } from "../common/data/Subject"
import { Gender } from "../common/data/Gender"
import { CourseType } from "../course/data/CourseType"

class SearchQuery {
    grade: Grade
    subject: Subject
    gender: Gender
    type: CourseType
    location: number | null
    page: number | null
    pageSize: number = 20
}

export default SearchQuery