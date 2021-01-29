import { Request, Response, NextFunction } from "express"
import { auth } from "../../configs/firebase/FirebaseConfig"
import ControllerCRUD from "../../core/Controller"

// handle result
import { SuccessResponse, FailureResponse } from "../../core/response/ResponseHandler"


class AuthenticationConroller extends ControllerCRUD {

}