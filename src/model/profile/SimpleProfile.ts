import Contact from "../Contact"
import { Gender } from "../common/data/Gender"

class SimpleProfile {
    id: string
    firstName: string
    lastName: string
    fullName: string
    picture: string
    gender: Gender
    contact: Contact
}

export default SimpleProfile