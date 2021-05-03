import { UserVerify } from "../common/data/UserVerify.enum"

class VerifyData {
    requestId: string
    documentUrl1: string
    documentUrl2: string
    documentUrl3: string
    type: UserVerify
}

export default VerifyData