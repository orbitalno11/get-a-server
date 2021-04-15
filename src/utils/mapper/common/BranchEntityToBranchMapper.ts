import {BranchEntity} from "../../../entity/education/branch.entity";
import Branch from "../../../model/education/Branch";

export const BranchEntityToBranchMapper = (from: BranchEntity): Branch => {
    const branch = new Branch()
    branch.id = from.id
    branch.title = from.title
    return branch
}