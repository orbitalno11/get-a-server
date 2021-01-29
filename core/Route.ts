import express from "express"
import ControllerCRUD from "./Controller"

export default abstract class Route {
    router = express.Router()
    abstract controller: ControllerCRUD

    abstract initialRoute(): void

    getRouter() {
        return this.router
    }
}