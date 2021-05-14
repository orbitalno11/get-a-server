import Contact from '../Contact'
import {Gender} from "../common/data/Gender"
import Profile from "./Profile"
import Subject from "../common/Subject"
import Address from "../location/Address"

class TutorProfile implements Profile {
    id: string
    firstname: string
    lastname: string
    fullNameText: string
    gender: Gender
    dateOfBirth: Date
    profileUrl: string | null
    email: string
    contact: Contact
    address: Address[]
    created: Date | null
    updated: Date | null
    introduction: string
    subject: Subject[]

    public static getTutorId(userId: string): string {
        return `tutor-${userId}`
    }
}

export default TutorProfile