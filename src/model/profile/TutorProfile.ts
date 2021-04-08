import Address from '../Address'
import Contact from '../Contact'
import { Gender } from "../common/data/Gender"
import Education from "../education/Education";
import ExamResult from "../education/ExamResult";

class TutorProfile {
  id: string
  firstname: string
  lastname: string
  fullName: string
  gender: Gender
  dateOfBirth: Date
  profileUrl: string | null
  introduction: string
  education: Education[]
  examResult: ExamResult[]
  email: string
  contact: Contact
  address: Address[] | null
  rating: number
  studentNumber: number
  created: Date | null
  updated: Date | null
}

export default TutorProfile