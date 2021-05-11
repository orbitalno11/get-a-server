import Address from "../location/Address"
import { Gender } from "../common/data/Gender"
import Subject from "../common/Subject"

class PublicProfile {
    id: string
    firstname: string
    lastname: string
    fullNameText: string
    gender: Gender
    picture: string
    introduction: string
    address: Address[]
    numberOfLearner: number
    rating: number
    interestedSubject: Subject[]
}

export default PublicProfile