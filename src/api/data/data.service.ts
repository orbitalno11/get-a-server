import { Injectable } from "@nestjs/common"
import DataRepository from "../../repository/DataRepository"
import Subject from "../../model/common/Subject"
import { launch } from "../../core/common/launch"
import Grade from "../../model/common/Grade"
import Branch from "../../model/education/Branch"
import Institute from "../../model/education/Institute"
import Exam from "../../model/education/Exam"

/**
 * Service class for data controller
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class DataService {
    constructor(private readonly repository: DataRepository) {
    }

    /**
     * Get subject list
     */
    getSubjectList(): Promise<Array<Subject>> {
        return launch(async () => {
            const subjects = await this.repository.getSubjectList()
            return subjects.map((subject) => Subject.create(subject.code, subject.title))
        })
    }

    /**
     * Get grade list
     */
    getGradeList(): Promise<Array<Grade>> {
        return launch(async () => {
            const grades = await this.repository.getGradeList()
            return grades.map((grade) => new Grade(grade.grade, grade.title))
        })
    }

    /**
     * Get branch list
     */
    getBranchList(): Promise<Array<Branch>> {
        return launch(async () => {
            const branches = await this.repository.getBranchList()
            return branches.map((branch) => Branch.create(branch.id, branch.title))
        })
    }

    /**
     * Get institute list
     */
    getInstituteList(): Promise<Array<Institute>> {
        return launch(async () => {
            const institutes = await this.repository.getInstituteList()
            return institutes.map((institute) => Institute.create(institute.id, institute.title))
        })
    }

    /**
     * Get exam type list
     */
    getExamList(): Promise<Array<Exam>> {
        return launch(async () => {
            const exams = await this.repository.getExamList()
            return exams.map((exam) => Exam.create(exam.id, exam.title))
        })
    }
}