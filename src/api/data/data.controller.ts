import { Controller, Get, UseFilters, UseInterceptors } from "@nestjs/common"
import { DataService } from "./data.service"
import { FailureResponseExceptionFilter } from "../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../core/exceptions/filters/ErrorException.filter"
import { TransformSuccessResponse } from "../../interceptors/TransformSuccessResponse.interceptor"
import IResponse from "../../core/response/IResponse"
import Subject from "../../model/common/Subject"
import { launch } from "../../core/common/launch"
import SuccessResponse from "../../core/response/SuccessResponse"
import Grade from "../../model/common/Grade"
import Branch from "../../model/education/Branch"
import Institute from "../../model/education/Institute"
import Exam from "../../model/education/Exam"
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"

/**
 * Controller class for "_data" api
 * @author orbitalno11 2020 A.D.
 */
@ApiTags("data")
@Controller("_data")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class DataController {
    constructor(private readonly service: DataService) {
    }

    /**
     * Get subject list
     */
    @Get("subject")
    @ApiOkResponse({ description: "subject list", type: Subject, isArray: true })
    @ApiInternalServerErrorResponse({ description: "Can not get data" })
    getSubjectList(): Promise<IResponse<Array<Subject>>> {
        return launch(async () => {
            const subjects = await this.service.getSubjectList()
            return SuccessResponse.create(subjects)
        })
    }

    /**
     * Get grade list
     */
    @Get("grade")
    @ApiOkResponse({ description: "grade list", type: Grade, isArray: true })
    @ApiInternalServerErrorResponse({ description: "Can not get data" })
    getGradeList(): Promise<IResponse<Array<Grade>>> {
        return launch(async () => {
            const grades = await this.service.getGradeList()
            return SuccessResponse.create(grades)
        })
    }

    /**
     * Get branch list
     */
    @Get("branch")
    @ApiOkResponse({ description: "branch list", type: Branch, isArray: true })
    @ApiInternalServerErrorResponse({ description: "Can not get data" })
    getBranchList(): Promise<IResponse<Array<Branch>>> {
        return launch(async () => {
            const branches = await this.service.getBranchList()
            return SuccessResponse.create(branches)
        })
    }

    /**
     * Get institute list
     */
    @Get("institute")
    @ApiOkResponse({ description: "institute list", type: Institute, isArray: true })
    @ApiInternalServerErrorResponse({ description: "Can not get data" })
    getInstituteList(): Promise<IResponse<Array<Institute>>> {
        return launch(async () => {
            const institutes = await this.service.getInstituteList()
            return SuccessResponse.create(institutes)
        })
    }

    /**
     * Get exam type list
     */
    @Get("exam")
    @ApiOkResponse({ description: "exam list", type: Exam, isArray: true })
    @ApiInternalServerErrorResponse({ description: "Can not get data" })
    getExamList(): Promise<IResponse<Array<Exam>>> {
        return launch(async () => {
            const exams = await this.service.getExamList()
            return SuccessResponse.create(exams)
        })
    }
}