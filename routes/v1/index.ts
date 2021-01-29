import express from "express"
import RoutePath from "../../models/constant/RoutePath"
import LearnerRouter from "./Learner"

class APIsV1 {
    private router = express.Router()

    private readonly learner: LearnerRouter = new LearnerRouter()

    constructor() {
        this.initialRoute()
    }

    private initialRoute() {
        this.router.use(`/${RoutePath.LEARNER_PATH}`, this.learner.getRouter())
    }

    getRouter(): express.Router {
        return this.router
    }
}

export default APIsV1