import { Request, Response, NextFunction } from "express"
import { v4 as uuid } from "uuid"
import DatabaseConnection from "../../configs/DatabaseConnection"

// controller
import ControllerCRUD from "../../core/Controller"

// handle result
import { FailureResponse, SuccessResponse } from "../../core/response/ResponseHandler"
import Database from "../../models/constant/Database"
import Learner from "../../models/Learner"
import LearnerFormToLearnerMapper from "../../utils/mapper/register/LearnerFormToLearnerMapper"

class LearnerController extends ControllerCRUD {
    private readonly table: string = Database.MEMBER_TABLE

    async create(req: Request, res: Response, next: NextFunction) {
        const data = req.body
        const inputData: Learner = new LearnerFormToLearnerMapper().map(data)
        console.log(inputData)
        next(new SuccessResponse<Learner>(inputData))
    }

    async read(req: Request, res: Response, next: NextFunction): Promise<void> {}
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {}
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {}
}

export default LearnerController