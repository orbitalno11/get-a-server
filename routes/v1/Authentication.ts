import AuthenticationConroller from "../../controllers/v1/AuthenticationController"
import Route from "../../core/Route"
import { controllerHandler } from "../../middlewares/ControllerHandler"

class AuthenticationRouter extends Route {
    controller = new AuthenticationConroller()

    constructor() {
        super()
        this.initialRoute()
    }

    initialRoute(): void {
        this.router.route("/get-profile-token").get(this.auth.isSignin, (req, res, next) => controllerHandler(this.controller.getTokenProfile(req, res, next)))
    }
}

export default AuthenticationRouter