import TutorController from "../../controllers/v1/TutorController"
import Route from "../../core/Route"
import { controllerHandler } from "../../middlewares/Controller"

class TutorRouter extends Route {
    controller = new TutorController()

    constructor() {
        super()
        this.initialRoute()
    }

    initialRoute(): void {
        this.router.route("/create").post((req, res, next) => controllerHandler(this.controller.create(req, res, next)))
    }
    
}

export default TutorRouter