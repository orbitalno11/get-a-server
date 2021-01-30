import UserRole from "./constant/UserRole"

interface CurrentUser {
    id: string | null
    role: UserRole | null
    token: string | null
}

export default CurrentUser