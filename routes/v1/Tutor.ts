import TutorController from "../../controllers/v1/TutorController"
import Route from "../../core/Route"
import { controllerHandler } from "../../middlewares/Controller"
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
    }
}

export default TutorRouter