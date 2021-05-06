import VerifyData from "../verify/VerifyData"
import ExamResult from "./ExamResult"

class TestingVerification {
    id: number
    fullRequestName: string
    fullExamTitle: string
    verifiedData: VerifyData
    exam: ExamResult
    created: Date
    updated: Date
}

export default TestingVerification