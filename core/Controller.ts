import { NextFunction, Request, Response } from "express"

export default abstract class ControllerCRUD {
    abstract create(req: Request, res: Response, next: NextFunction): void
    abstract read(req: Request, res: Response, next: NextFunction): void
    abstract update(req: Request, res: Response, next: NextFunction):void
    abstract delete(req: Request, res: Response, next: NextFunction):void
}