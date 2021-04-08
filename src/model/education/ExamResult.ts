import Exam from "./Exam";
import {EducationRequestStatus} from "./data/EducationRequestStatus";

class ExamResult {
    exam: Exam
    examText: string
    score: number
    status: EducationRequestStatus
}

export default ExamResult