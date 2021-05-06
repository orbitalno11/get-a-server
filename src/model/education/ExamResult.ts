import Exam from "./Exam";
import { RequestStatus } from "../common/data/RequestStatus"
import Subject from "../common/Subject"

class ExamResult {
    exam: Exam
    examText: string
    subject: Subject
    subjectText: string
    score: number
    verified: RequestStatus
}

export default ExamResult