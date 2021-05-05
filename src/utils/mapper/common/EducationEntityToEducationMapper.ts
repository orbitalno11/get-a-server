import {EducationHistoryEntity} from "../../../entity/education/educationHistory.entity";
import Education from "../../../model/education/Education";
import {InstituteEntityToInstituteMapper} from "./InstituteEntityToInstituteMapper";
import {BranchEntityToBranchMapper} from "./BranchEntityToBranchMapper";
import Mapper from "../../../core/common/Mapper";
import { EducationStatus } from "../../../model/education/data/EducationStatus.enum"

export class EducationEntityToEducationMapper implements Mapper<EducationHistoryEntity, Education> {
    map(from: EducationHistoryEntity): Education {
        const education = new Education()
        education.institute = InstituteEntityToInstituteMapper(from.institute)
        education.instituteText = from.institute.title
        education.branch = BranchEntityToBranchMapper(from.branch)
        education.branchText = from.branch.title
        education.gpax = from.gpax
        education.status = from.status as EducationStatus
        education.verified = from.verified
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