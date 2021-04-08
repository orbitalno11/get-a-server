import Mapper from "../../../core/common/Mapper";
import {ExamTypeEntity} from "../../../entity/education/examType.entity";
import Exam from "../../../model/education/Exam";

export class ExamEntityToExamMapper implements Mapper<ExamTypeEntity, Exam> {
    map(from: ExamTypeEntity): Exam {
        const exam = new Exam()
        exam.id = from.id
        exam.title = from.title
        return exam
    }
}