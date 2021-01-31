import Address from "../Address"

interface Learner {
    id: string | null
    firstname: string
    lastname: string
    gender: string
    dateOfBirth: Date
    address1: Address | null
    address2: Address | null
    email: string
    username: string
    created: Date | null
    updated: Date | null
}

export default Learner