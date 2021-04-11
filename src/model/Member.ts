import Address from "./location/Address"
import User from "./User"
import { Gender } from "./common/data/Gender"

class Member extends User {
  firstname: string
  lastname: string
  gender: Gender
  dateOfBirth: Date
  address1: Address | string | null
  address2: Address | string | null
  created: Date | null
  updated: Date | null
}

export default Member
