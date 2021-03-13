import UserRole from "../../../core/constant/UserRole"
import User from "../../../models/common/User"

interface IMember {
    member_id: string
    username: string
    email: string
    role_id: number
}

const getUserRole = (roleId: number): UserRole => {
    switch(roleId) {
        case 0: return UserRole.ADMIN
        case 1: return UserRole.LEARNER
        case 2: return UserRole.TUTOR
        case 3: return UserRole.TUTOR_LEARNER
        default: return UserRole.VISITOR
    }
}

const IMemberToUserMapper = (from: IMember): User => (
    {
        id: from.member_id,
        username: from.username,
        email: from.email,
        role: getUserRole(from.role_id)
    }
)

export default IMemberToUserMapper