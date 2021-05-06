import TutorProfile from "../profile/TutorProfile"
import VerifyData from "../verify/VerifyData"
import Education from "./Education"

class EducationVerification {
    id: number
    fullRequestName: string
    profile: TutorProfile
    verifiedData: VerifyData
    educationData: Education
    created: Date
    updated: Date
}

export default EducationVerification