import {TestingHistoryEntity} from "../../../entity/education/testingHistory.entity";
import ExamResult from "../../../model/education/ExamResult";
import Mapper from "../../../core/common/Mapper";
import {ExamEntityToExamMapper} from "./ExamEntityToExamMapper";
import {EducationRequestStatus} from "../../../model/education/data/EducationRequestStatus";

export class ExamResultEntityToExamResultMapper implements Mapper<TestingHistoryEntity, ExamResult> {
    map(from: TestingHistoryEntity): ExamResult {
        const result = new ExamResult()
        result.exam = new ExamEntityToExamMapper().map(from.exam)
        result.examText = result.exam.title
        result.score = from.testingScore
        result.status = from.status as EducationRequestStatus
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