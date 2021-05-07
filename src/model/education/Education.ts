import Institute from "./Institute";
import Branch from "./Branch";
import {RequestStatus} from "../common/data/RequestStatus";
import { EducationStatus } from "./data/EducationStatus.enum"

class Education {
    id: number
    institute: Institute
    instituteText: string
    branch: Branch
    branchText: string
    gpax: number
    status: EducationStatus
    verified: RequestStatus
}

export default Education