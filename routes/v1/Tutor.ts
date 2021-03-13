import TutorController from "../../controllers/v1/TutorController"
import Route from "../../core/Route"
import { controllerHandler } from "../../middlewares/ControllerHandler"
import UploadImageMiddleware from "../../middlewares/multer/UploadImage"

class TutorRouter extends Route {
    controller = new TutorController()

    constructor() {
        super()
        this.initialRoute()
    }

    initialRoute(): void {
        const uploadMiddleware = new UploadImageMiddleware()
        const uploader2MB = uploadMiddleware.uploadImage2Mb("tutor")

        this.router.route("/create").post(uploader2MB, (req, res, next) => controllerHandler(this.controller.create(req, res, next)))
        this.router.route("/:id")
            .get((req, res, next) => controllerHandler(this.controller.read(req, res, next)))
            .put(uploader2MB, (req, res, next) => controllerHandler(this.controller.update(req, res, next)))
            .delete((req, res, next) => controllerHandler(this.controller.delete(req, res, next)))
    }
}

export default TutorRouter