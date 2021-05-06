import VerifyData from "../verify/VerifyData"
import ExamResult from "./ExamResult"

class TestingVerification {
    id: string
    fullRequestName: string
    fullExamTitle: string
    verifiedData: VerifyData
    exam: ExamResult
    created: Date
    updated: Date
}

export default TestingVerification