import EducationVerification from "../../../model/education/EducationVerification"
import { UserVerifyToVerifyDataMapper } from "./UserVerifyToVerifyData.mapper"
import { EducationEntityToEducationMapper } from "../common/EducationEntityToEducationMapper"
import { UserVerifyEntity } from "../../../entity/UserVerify.entity"

export const UserVerifyToEducationMapper = (from: UserVerifyEntity): EducationVerification => {
    const verification = new EducationVerification()
    verification.id = from.id
    verification.fullRequestName = `${from.member?.firstname} ${from.member?.lastname}`
    verification.verifiedData = UserVerifyToVerifyDataMapper(from)
    verification.educationData = new EducationEntityToEducationMapper().map(from.educationHistory)
    verification.created = from.created
    verification.updated = from.updated
    return verification
}

const UserVerifyToSimpleEducationMapper = (from: UserVerifyEntity): EducationVerification => {
    const verification = new EducationVerification()
    verification.id = from.id
    verification.fullRequestName = `${from.member?.firstname} ${from.member?.lastname}`
    verification.created = from.created
    verification.updated = from.updated
    return verification
}

export const UserVerifyToEducationListMapper = (from: UserVerifyEntity[]): EducationVerification[] => {
    return from.map((item) => UserVerifyToSimpleEducationMapper(item))
}