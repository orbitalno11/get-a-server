import express from "express"
import AuthenticationMiddleware from "../middlewares/Authentication"
import ControllerCRUD from "./Controller"

export default abstract class Route {
    router = express.Router()
    auth = new AuthenticationMiddleware()
    abstract controller: ControllerCRUD

    abstract initialRoute(): void

    getRouter() {
        return this.router
    }
}