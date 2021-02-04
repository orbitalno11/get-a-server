import CurrentUser from "../../models/CurrentUser"

declare global {
    namespace Express {
        interface Request {
            currentUser: CurrentUser
        }
    }
}