import { TestingHistoryEntity } from "../../../entity/education/testingHistory.entity"
import ExamResult from "../../../model/education/ExamResult"
import Mapper from "../../../core/common/Mapper"
import { ExamEntityToExamMapper } from "./ExamEntityToExamMapper"
import { RequestStatus } from "../../../model/common/data/RequestStatus"
import Subject from "../../../model/common/Subject"

export class ExamResultEntityToExamResultMapper implements Mapper<TestingHistoryEntity, ExamResult> {
    map(from: TestingHistoryEntity): ExamResult {
        const result = new ExamResult()
        result.id = from.id
        result.exam = new ExamEntityToExamMapper().map(from.exam)
        result.examText = result.exam.title
        result.subject = new Subject(from.subject?.code, from.subject?.title)
        result.subjectText = result.subject.title
        result.score = from.testingScore
        result.year = from.year
        result.verified = from.verified as RequestStatus
        return result
    }

    toExamResultArray(data: TestingHistoryEntity[]): ExamResult[] {
        const out: ExamResult[] = []
        data.forEach(item => {
            out.push(this.map(item))
        })
        return out
    }
}