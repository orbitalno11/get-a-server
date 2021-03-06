import UserRole from "../../../core/constant/UserRole"
import CurrentUser from "../CurrentUser"

class CurrentUserModel implements CurrentUser {
    id: string | null
    role: UserRole | null
    token: string | null

    constructor(data: CurrentUser) {
        this.id = data.id
        this.role = data.role
        this.token = data.token
    }
}

export default CurrentUserModel