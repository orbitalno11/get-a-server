import LearnerController from "../../controllers/v1/LearnerController"
import Route from "../../core/Route"
import { controllerHandler } from "../../middlewares/Controller"

class LearnerRouter extends Route {
    controller = new LearnerController()

    constructor() {
        super()
        this.initialRoute()
    }

    initialRoute(): void {
        this.router.route("/create").post((req, res, next) => controllerHandler(this.controller.create(req, res, next)))
        this.router.route("/:id")
            .get((req, res, next) => controllerHandler(this.controller.read(req, res, next)))
            .put((req, res, next) => controllerHandler(this.controller.update(req, res, next)))
    }

}

export default LearnerRouter