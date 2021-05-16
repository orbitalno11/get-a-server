import VerifyData from "../verify/VerifyData"
import Education from "./Education"

class EducationVerification {
    id: string
    fullRequestName: string
    verifiedData: VerifyData
    educationData: Education
    created: Date
    updated: Date
}

export default EducationVerification