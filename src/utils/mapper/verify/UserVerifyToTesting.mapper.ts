import TestingVerification from "../../../model/education/TestingVerification"
import { UserVerifyToVerifyDataMapper } from "./UserVerifyToVerifyData.mapper"
import { ExamResultEntityToExamResultMapper } from "../common/ExamResultEntityToExamResultMapper"
import { UserVerifyEntity } from "../../../entity/UserVerify.entity"

export const UserVerifyToTestingMapper = (from: UserVerifyEntity): TestingVerification => {
    const verification = new TestingVerification()
    verification.id = from.id
    verification.fullRequestName = `${from.member?.firstname} ${from.member?.lastname}`
    verification.fullExamTitle = `${from.testingHistory?.exam?.title}, ${from.testingHistory?.subject?.title}`
    verification.verifiedData = UserVerifyToVerifyDataMapper(from)
    verification.exam = new ExamResultEntityToExamResultMapper().map(from.testingHistory)
    verification.created = from.created
    verification.updated = from.updated
    return verification
}

export const UserVerifyToSimpleTestingMapper = (from: UserVerifyEntity): TestingVerification => {
    const verification = new TestingVerification()
    verification.id = from.id
    verification.fullRequestName = `${from.member?.firstname} ${from.member?.lastname}`
    verification.fullExamTitle = `${from.testingHistory?.exam?.title}, ${from.testingHistory?.subject?.title}`
    verification.created = from.created
    verification.updated = from.updated
    return verification
}

export const TestingHistoryToVerificationListMapper = (from: UserVerifyEntity[]): TestingVerification[] => {
    return from.map((item) => UserVerifyToSimpleTestingMapper(item))
}