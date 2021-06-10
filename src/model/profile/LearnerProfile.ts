import Contact from "../Contact"
import { Gender } from "../common/data/Gender"
import Profile from "./Profile"
import Grade from "../common/Grade"

class LearnerProfile implements Profile {
    id: string
    firstname: string
    lastname: string
    fullNameText: string
    gender: Gender
    dateOfBirth: Date
    profileUrl: string | null
    email: string
    contact: Contact
    address: string
    created: Date | null
    updated: Date | null
    verified: boolean
    grade: Grade

    public static getLearnerId(userId: string): string {
        return `learner-${userId}`
    }
}

export default LearnerProfile