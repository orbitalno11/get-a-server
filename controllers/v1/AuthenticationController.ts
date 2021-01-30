import { Request, Response, NextFunction } from "express"
import { authentication } from "../../configs/firebase/FirebaseConfig"
import ControllerCRUD from "../../core/Controller"

// handle result
import { SuccessResponse, FailureResponse } from "../../core/response/ResponseHandler"


class AuthenticationConroller extends ControllerCRUD {
    async getTokenProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        const currentUser = req.currentUser
        try {
            if (!currentUser) return next(new FailureResponse("Can not find user from token", 400))

            
        } catch (err) {

        }
    }
}