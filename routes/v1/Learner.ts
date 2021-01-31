import multer from "multer"
import LearnerController from "../../controllers/v1/LearnerController"
import Route from "../../core/Route"
import { controllerHandler } from "../../middlewares/Controller"
import UploadImageMiddleware from "../../middlewares/multer/UploadImage"

class LearnerRouter extends Route {
    controller = new LearnerController()

    constructor() {
        super()
        this.initialRoute()
    }

    initialRoute(): void {
        const uploadMiddleware = new UploadImageMiddleware()
        const uploader2MB = uploadMiddleware.uploadImage2Mb("learner")

        this.router.route("/create").post(uploader2MB, (req, res, next) => controllerHandler(this.controller.create(req, res, next)))
        this.router.route("/:id")
            .get((req, res, next) => controllerHandler(this.controller.read(req, res, next)))
            .put(uploader2MB, (req, res, next) => controllerHandler(this.controller.update(req, res, next)))
    }

}

export default LearnerRouter