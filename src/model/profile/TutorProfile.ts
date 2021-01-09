import Address from '../Address'
import Contact from '../Contact'
import { Gender } from "../common/Gender"

class TutorProfile {
  firstname: string
  lastname: string
  gender: Gender
  dateOfBirth: Date
  profileUrl: string | null
  introduction: string
  email: string
  contact: Contact
  address: Address[] | null
  created: Date | null
  updated: Date | null
}

export default TutorProfile