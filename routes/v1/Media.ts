import MediaController from "../../controllers/v1/MediaController"
import Route from "../../core/Route"
import { controllerHandler } from "../../middlewares/Controller"

class MediaRouter extends Route {
    controller = new MediaController()

    constructor() {
        super()
        this.initialRoute()
    }

    initialRoute(): void {
        this.router.route("/img/profile/:name").get((req, res, next) => controllerHandler(this.controller.getImage(req, res, next)))
    }
}

export default MediaRouter