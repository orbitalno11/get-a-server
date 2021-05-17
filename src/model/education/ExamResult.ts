import Exam from "./Exam";
import { RequestStatus } from "../common/data/RequestStatus"
import Subject from "../common/Subject"

class ExamResult {
    id: number
    exam: Exam
    examText: string
    subject: Subject
    subjectText: string
    score: number
    year: string
    verified: RequestStatus
}

export default ExamResult