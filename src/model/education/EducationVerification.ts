import VerifyData from "../verify/VerifyData"
import Education from "./Education"

class EducationVerification {
    id: number
    fullRequestName: string
    verifiedData: VerifyData
    educationData: Education
    created: Date
    updated: Date
}

export default EducationVerification