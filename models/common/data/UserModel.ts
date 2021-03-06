import User from "../User"

class UserModel implements User {
    id: string | null
    email: string
    username: string
    role: number

    constructor(data: User) {
        this.id = data.id
        this.email = data.email
        this.username = data.username
        this.role = Number(data.role)
    }
}

export default UserModel