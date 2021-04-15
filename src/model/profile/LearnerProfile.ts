import Contact from "../Contact"
import {Gender} from "../common/data/Gender"
import Address from "../location/Address";

class LearnerProfile {
    firstname: string
    lastname: string
    gender: Gender
    dateOfBirth: Date
    profileUrl: string | null
    email: string
    contact: Contact
    address: Address[] | null
    created: Date | null
    updated: Date | null

    public static getLearnerId(userId: string): string {
        return `learner-${userId}`
    }
}

export default LearnerProfile