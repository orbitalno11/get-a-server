import Institute from "./Institute";
import Branch from "./Branch";
import {RequestStatus} from "../common/data/RequestStatus";
import { EducationStatus } from "./data/EducationStatus.enum"
import Grade from "../common/Grade"

class Education {
    id: number
    institute: Institute
    instituteText: string
    branch: Branch
    branchText: string
    gpax: number
    grade: Grade
    status: EducationStatus
    verified: RequestStatus
}

export default Education