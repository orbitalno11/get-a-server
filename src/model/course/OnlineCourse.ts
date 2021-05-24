import PublicProfile from "../profile/PublicProfile"
import Subject from "../common/Subject"
import Grade from "../common/Grade"

class OnlineCourse {
    id: string
    name: string
    coverUrl: string
    subject: Subject
    grade: Grade
    owner: PublicProfile
    rating: number
    numberOfView: number
}

export default OnlineCourse