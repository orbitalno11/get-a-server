import Address from '../location/Address'
import Contact from '../Contact'
import {Gender} from "../common/data/Gender"
import Education from "../education/Education";
import ExamResult from "../education/ExamResult";
import Profile from "./Profile"

class TutorProfile implements Profile {
    id: string
    firstname: string
    lastname: string
    fullName: string
    gender: Gender
    dateOfBirth: Date
    profileUrl: string | null
    introduction: string
    education: Education[]
    examResult: ExamResult[]
    email: string
    contact: Contact
    address: Address[] | null
    rating: number
    studentNumber: number
    created: Date | null
    updated: Date | null

    public static getTutorId(userId: string): string {
        return `tutor-${userId}`
    }
}

export default TutorProfile