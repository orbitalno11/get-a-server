import VerifyData from "./VerifyData"

class IdentityVerification {
    id: string
    fullNameRequest: string
    email: string
    verifiedData: VerifyData
    verified: boolean
    created: Date
    updated: Date
}

export default IdentityVerification