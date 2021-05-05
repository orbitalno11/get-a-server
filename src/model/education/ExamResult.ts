import Exam from "./Exam";
import { RequestStatus } from "../common/data/RequestStatus"

class ExamResult {
    exam: Exam
    examText: string
    score: number
    status: RequestStatus
}

export default ExamResult