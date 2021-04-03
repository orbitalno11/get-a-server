import Institute from "./Institute";
import Branch from "./Branch";
import {EducationRequestStatus} from "./data/EducationRequestStatus";

class Education {
    institute: Institute
    instituteText: string
    branch: Branch
    branchText: string
    gpax: number
    status: EducationRequestStatus
}

export default Education