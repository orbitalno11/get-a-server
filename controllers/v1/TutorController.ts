import { NextFunction, Request, Response } from "express"
import DatabaseConnection from "../../configs/DatabaseConnection"
import ControllerCRUD from "../../core/Controller"
import TutorRepository from "../../repository/TutorRepository"

class TutorController extends ControllerCRUD {
    private readonly databaseConnection: DatabaseConnection = new DatabaseConnection()
    private readonly tutorRepository: TutorRepository = new TutorRepository(this.databaseConnection)

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