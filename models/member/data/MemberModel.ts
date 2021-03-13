import Address from "../../common/Address"
import Member from "../Member"
class MemberModel implements Member {
    firstname: string
    lastname: string
    gender: string
    dateOfBirth: Date
    profileUrl: string | null
    address1: string | Address | null
    address2: string | Address | null
    created: Date | null
    updated: Date | null
    id: string | null
    email: string
    username: string
    role: number

    constructor(member: Member) {
        this.firstname = member.firstname
        this.lastname = member.lastname
        this.gender = member.gender
        this.dateOfBirth = new Date(member.dateOfBirth)
        this.profileUrl = member.profileUrl
        this.address1 = member.address1
        this.address2 = member.address2
        this.created = member.created ? new Date(member.created) : null
        this.updated = member.updated ? new Date(member.updated) : null
        this.id = member.id
        this.email = member.email
        this.username = member.username
        this.role = Number(member.role)
    }
}

export default MemberModel