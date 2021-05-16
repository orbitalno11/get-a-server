import {InstituteEntity} from "../../../entity/education/institute.entity";
import Institute from "../../../model/education/Institute";

export const InstituteEntityToInstituteMapper = (from: InstituteEntity): Institute => {
    const institute = new Institute()
    institute.id = from.id
    institute.name = from.title
    return institute
}