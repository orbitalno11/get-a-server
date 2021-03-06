import Contact from "../Contact"

class ContactModel implements Contact {
    phoneNumber: string | null
    lineId: string | null
    facebookUrl: string | null

    constructor(data: Contact) {
        this.phoneNumber = data.phoneNumber
        this.lineId = data.lineId
        this.facebookUrl = data.facebookUrl
    }
}

export default ContactModel