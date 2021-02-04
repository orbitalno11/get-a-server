import { NextFunction, Request, Response } from "express"
import ControllerCRUD from "../../core/Controller"

class TutorController extends ControllerCRUD {

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {

    }
    
    async read(req: Request, res: Response, next: NextFunction): Promise<void> {

    }
    
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {

    }
    
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {

    }
}

export default TutorController