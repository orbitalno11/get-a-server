import Contact from "../Contact"
import {Gender} from "../common/data/Gender"
import Address from "../location/Address";
import Profile from "./Profile"
import Grade from "../common/Grade"

class LearnerProfile implements Profile{
    id: string
    firstname: string
    lastname: string
    gender: Gender
    dateOfBirth: Date
    profileUrl: string | null
    email: string
    contact: Contact
    address: Address[] | null
    grade: Grade
    created: Date | null
    updated: Date | null

    public static getLearnerId(userId: string): string {
        return `learner-${userId}`
    }
}

export default LearnerProfile