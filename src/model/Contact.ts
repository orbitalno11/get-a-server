import { ContactEntity } from '../entity/contact/contact.entitiy'

class Contact {
  phoneNumber: string | null
  lineId: string | null
  facebookUrl: string | null

  // static method
  public static createFromContactEntity(data: ContactEntity): Contact {
    const contact = new Contact()
    contact.phoneNumber = data.phoneNumber
    contact.lineId = data.lineId
    contact.facebookUrl = data.facebookUrl
    return contact
  }
}

export default Contact