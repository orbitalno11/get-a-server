import CurrentUser from "../../models/common/CurrentUser"

declare global {
    namespace Express {
        interface Request {
            currentUser: CurrentUser
        }
    }
}