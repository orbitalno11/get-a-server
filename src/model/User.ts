import { UserRoleKey } from "../core/constant/UserRole"

export default class User {
  id: string | null
  email: string
  username: string
  profileUrl: string | null
  role: UserRoleKey
}
