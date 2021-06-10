import {Gender} from "../common/data/Gender"
import Contact from "../Contact"

interface Profile {
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
}

export default Profile