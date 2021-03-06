import Address from "../common/Address"
import User from "../common/User"

interface Member extends User {
    firstname: string
    lastname: string
    gender: string
    dateOfBirth: Date
    profileUrl: string | null
    address1: Address | string | null
    address2: Address | string | null
    created: Date | null
    updated: Date | null
}

export default Member