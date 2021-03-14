import express from "express"
import RoutePath from "../../core/constant/RoutePath"
import AuthenticationRouter from "./Authentication"
import LearnerRouter from "./Learner"
import MediaRouter from "./Media"
import OfflineCourseRoute from "./OfflineCourse"
import TutorRouter from "./Tutor"

class APIsV1 {
    private router = express.Router()

    private readonly authentication: AuthenticationRouter = new AuthenticationRouter()
    private readonly learner: LearnerRouter = new LearnerRouter()
    private readonly tutor: TutorRouter = new TutorRouter()
    private readonly offlineCourse: OfflineCourseRoute = new OfflineCourseRoute()
    private readonly media: MediaRouter = new MediaRouter()

    constructor() {
        this.initialRoute()
    }

    private initialRoute() {
        this.router.use(`/${RoutePath.AUTH_PATH}`, this.authentication.getRouter())
        this.router.use(`/${RoutePath.LEARNER_PATH}`, this.learner.getRouter())
        this.router.use(`/${RoutePath.TUTOR_PATH}`, this.tutor.getRouter())
        this.router.use(`/${RoutePath.OFFLINE_COURSE}`, this.offlineCourse.getRouter())
        this.router.use(`/${RoutePath.MEDIA_PATH}`, this.media.getRouter())
    }

    getRouter(): express.Router {
        return this.router
    }
}

export default APIsV1