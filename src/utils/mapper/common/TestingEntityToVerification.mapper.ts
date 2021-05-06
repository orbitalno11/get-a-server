import { TestingHistoryEntity } from "../../../entity/education/testingHistory.entity"
import TestingVerification from "../../../model/education/TestingVerification"
import { UserVerifyToVerifyDataMapper } from "../verify/UserVerifyToVerifyData.mapper"
import { ExamResultEntityToExamResultMapper } from "./ExamResultEntityToExamResultMapper"

export const TestingEntityToVerificationMapper = (from: TestingHistoryEntity): TestingVerification => {
    const verification = new TestingVerification()
    verification.id = from.id
    verification.fullRequestName = `${from.tutor?.member?.firstname} ${from.tutor?.member?.lastname}`
    verification.fullExamTitle = `${from.exam?.title}, ${from.subject?.title}`
    verification.verifiedData = UserVerifyToVerifyDataMapper(from.verifiedData)
    verification.exam = new ExamResultEntityToExamResultMapper().map(from)
    verification.created = from.verifiedData?.created
    verification.updated = from.verifiedData?.updated
    return verification
}

export const TestingEntityToSimpleVerificationMapper = (from: TestingHistoryEntity): TestingVerification => {
    const verification = new TestingVerification()
    verification.id = from.id
    verification.fullRequestName = `${from.tutor?.member?.firstname} ${from.tutor?.member?.lastname}`
    verification.fullExamTitle = `${from.exam?.title}, ${from.subject?.title}`
    verification.created = from.verifiedData?.created
    verification.updated = from.verifiedData?.updated
    return verification
}

export const TestingHistoryToVerificationListMapper = (from: TestingHistoryEntity[]): TestingVerification[] => {
    return from.map((item) => TestingEntityToSimpleVerificationMapper(item))
}