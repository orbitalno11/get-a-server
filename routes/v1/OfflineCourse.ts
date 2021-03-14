import OfflineCourseController from "../../controllers/v1/OfflineCourseController"
import Route from "../../core/Route"
import { controllerHandler } from "../../middlewares/ControllerHandler"

class OfflineCourseRoute extends Route {
    controller = new OfflineCourseController()

    constructor() {
        super()
        this.initialRoute()
    }

    initialRoute(): void {
        this.router.route("/create").post(this.auth.isTutor, (req, res, next) => controllerHandler(this.controller.create(req, res, next)))
    }

}

export default OfflineCourseRoute