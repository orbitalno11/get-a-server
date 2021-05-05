import Exam from "./Exam";
import { RequestStatus } from "../common/data/RequestStatus"

class ExamResult {
    exam: Exam
    examText: string
    score: number
    verified: RequestStatus
}

export default ExamResult