import { NextFunction, Request, Response } from "express"

export default abstract class ControllerCRUD {
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {}
    async read(req: Request, res: Response, next: NextFunction): Promise<void> {}
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {}
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {}
}