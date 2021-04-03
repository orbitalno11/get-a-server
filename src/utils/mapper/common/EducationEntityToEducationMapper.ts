import {EducationHistoryEntity} from "../../../entity/education/educationHistory.entity";
import Education from "../../../model/education/Education";
import {InstituteEntityToInstituteMapper} from "./InstituteEntityToInstituteMapper";
import {BranchEntityToBranchMapper} from "./BranchEntityToBranchMapper";
import {EducationRequestStatus} from "../../../model/education/data/EducationRequestStatus";
import Mapper from "../../../core/common/Mapper";

export class EducationEntityToEducationMapper implements Mapper<EducationHistoryEntity, Education> {
    map(from: EducationHistoryEntity): Education {
        const education = new Education()
        education.institute = InstituteEntityToInstituteMapper(from.institute)
        education.instituteText = from.institute.title
        education.branch = BranchEntityToBranchMapper(from.branch)
        education.branchText = from.branch.title
        education.gpax = from.gpax
        education.status = from.status as EducationRequestStatus
        return education
    }

    toEducationArray(data: EducationHistoryEntity[]): Education[] {
        const out: Education[] = []
        data.forEach(item => {
            out.push(this.map(item))
        })
        return out
    }
}