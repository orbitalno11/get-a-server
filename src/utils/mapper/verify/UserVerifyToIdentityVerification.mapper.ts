import { UserVerifyEntity } from "../../../entity/UserVerify.entity"
import IdentityVerification from "../../../model/verify/IdentityVerification"
import { UserVerifyToVerifyDataMapper } from "./UserVerifyToVerifyData.mapper"

export const UserVerifyToIdentityVerificationMapper = (from: UserVerifyEntity): IdentityVerification => {
    const verification = new IdentityVerification()
    verification.id = from.id
    verification.fullNameRequest = `${from.member?.firstname} ${from.member?.lastname}`
    verification.email = from.member?.email
    verification.verifiedData = UserVerifyToVerifyDataMapper(from)
    verification.created = from.created
    verification.updated = from.updated
    verification.verified = from.member?.verified
    return verification
}

export const UserVerifyToSimpleIdentityVerificationMapper = (from: UserVerifyEntity): IdentityVerification => {
    const verification = new IdentityVerification()
    verification.id = from.id
    verification.fullNameRequest = `${from.member?.firstname} ${from.member?.lastname}`
    verification.created = from.created
    verification.updated = from.updated
    return verification
}

export const UserVerifyToVerificationListMapper = (from: UserVerifyEntity[]): IdentityVerification[] => {
    return from.map((item) => UserVerifyToSimpleIdentityVerificationMapper(item))
}

