import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { SubjectEntity } from "../entity/common/subject.entity"
import { logger } from "../core/logging/Logger"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import CommonError from "../core/exceptions/constants/common-error.enum"
import { GradeEntity } from "../entity/common/grade.entity"
import { BranchEntity } from "../entity/education/branch.entity"
import { InstituteEntity } from "../entity/education/institute.entity"
import { ExamTypeEntity } from "../entity/education/examType.entity"

/**
 * Repository class for data api module
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class DataRepository {
    constructor(private readonly connection: Connection) {
    }

    /**
     * Get subject list
     */
    async getSubjectList(): Promise<Array<SubjectEntity>> {
        try {
            return await this.connection.getRepository(SubjectEntity).find()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get data", CommonError.CAN_NOT_GET_DATA)
        }
    }

    /**
     * Get grade list
     */
    async getGradeList(): Promise<Array<GradeEntity>> {
        try {
            return await this.connection.getRepository(GradeEntity).find()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get data", CommonError.CAN_NOT_GET_DATA)
        }
    }

    /**
     * Get branch list
     */
    async getBranchList(): Promise<Array<BranchEntity>> {
        try {
            return await this.connection.getRepository(BranchEntity).find()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get data", CommonError.CAN_NOT_GET_DATA)
        }
    }

    /**
     * Get institute list
     */
    async getInstituteList(): Promise<Array<InstituteEntity>> {
        try {
            return await this.connection.getRepository(InstituteEntity).find()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get data", CommonError.CAN_NOT_GET_DATA)
        }
    }

    /**
     * Get exam type list
     */
    async getExamList(): Promise<Array<ExamTypeEntity>> {
        try {
            return await this.connection.getRepository(ExamTypeEntity).find()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get data", CommonError.CAN_NOT_GET_DATA)
        }
    }
}

export default DataRepository