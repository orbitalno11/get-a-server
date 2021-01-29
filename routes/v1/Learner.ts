import LearnerController from "../../controllers/v1/LearnerController"
import Controller from "../../core/Controller"
import Route from "../../core/Route"
import { controllerHandler } from "../../middlewares/Controller"

class LearnerRouter extends Route {
    controller: Controller = new LearnerController()

    constructor() {
        super()
        this.initialRoute()
    }

    initialRoute(): void {
        this.router.route('/create').post((req, res, next) => controllerHandler(this.controller.create(req, res, next)))
    }

}

export default LearnerRouter