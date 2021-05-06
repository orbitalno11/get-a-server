import { UserVerifyEntity } from "../../../entity/UserVerify.entity"
import VerifyData from "../../../model/verify/VerifyData"

export const UserVerifyToVerifyDataMapper = (from: UserVerifyEntity): VerifyData => {
    const data = new VerifyData()
    data.requestId = from.id
    data.documentUrl1 = from.documentUrl1
    data.documentUrl2 = from.documentUrl2
    data.documentUrl3 = from.documentUrl3
    data.type = from.type
    return data
}