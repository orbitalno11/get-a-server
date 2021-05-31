import MyCourse from "../course/MyCourse"
import OnlineCourseCard from "../course/OnlineCourseCard"
import TutorCard from "../profile/TutorCard"

class SearchResultPage {
    currentPage: number
    nextPage: number | null
    pageSize: number
    offlineCourse: Array<TutorCard>
    onlineCourse: Array<OnlineCourseCard>
    nearby: Array<MyCourse>
}

export default SearchResultPage