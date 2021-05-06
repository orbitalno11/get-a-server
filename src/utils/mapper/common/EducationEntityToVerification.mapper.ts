import { EducationHistoryEntity } from "../../../entity/education/educationHistory.entity"
import EducationVerification from "../../../model/education/EducationVerification"
import { UserVerifyToVerifyDataMapper } from "../verify/UserVerifyToVerifyData.mapper"
import { EducationEntityToEducationMapper } from "./EducationEntityToEducationMapper"

export const EducationHistoryToVerificationMapper = (from: EducationHistoryEntity): EducationVerification => {
    const verification = new EducationVerification()
    verification.id = from.id
    verification.fullRequestName = `${from.tutor?.member?.firstname} ${from.tutor?.member?.lastname}`
    verification.verifiedData = UserVerifyToVerifyDataMapper(from.verifiedData)
    verification.educationData = new EducationEntityToEducationMapper().map(from)
    verification.created = from.verifiedData?.created
    verification.updated = from.verifiedData?.updated
    return verification
}

const EducationHistoryToSimpleVerificationMapper = (from: EducationHistoryEntity): EducationVerification => {
    const verification = new EducationVerification()
    verification.id = from.id
    verification.fullRequestName = `${from.tutor?.member?.firstname} ${from.tutor?.member?.lastname}`
    verification.created = from.verifiedData?.created
    verification.updated = from.verifiedData?.updated
    return verification
}

export const EducationHistoryToVerificationListMapper = (from: EducationHistoryEntity[]): EducationVerification[] => {
    return from.map((item) => EducationHistoryToSimpleVerificationMapper(item))
}