import Address from "../location/Address"
import Subject from "../common/Subject"

class TutorCard {
    id: string
    fullNameText: string
    address: Address
    subject: Subject
    rating: number
}

export default TutorCard