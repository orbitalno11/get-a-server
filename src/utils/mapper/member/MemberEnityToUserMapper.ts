import {UserRoleKey} from '../../../core/constant/UserRole';
import {MemberEntity} from '../../../entity/member/member.entitiy';
import User from '../../../model/User';
import Mapper from "../../../core/common/Mapper";

export class MemberEntityToUserMapper implements Mapper<MemberEntity, User> {
    private readonly role: number

    constructor(role: number) {
        this.role = role
    }

    map(from: MemberEntity): User {
        const user = new User()
        user.id = from.id
        user.username = from.username
        user.email = from.email
        user.profileUrl = from.profileUrl
        user.role = this.getUserRole(this.role)
        return user
    }

    private getUserRole(roleId: number): UserRoleKey {
        switch (roleId) {
            case 0:
                return UserRoleKey.ADMIN;
            case 1:
                return UserRoleKey.LEARNER;
            case 2:
                return UserRoleKey.TUTOR;
            case 3:
                return UserRoleKey.TUTOR_LEARNER;
            default:
                return UserRoleKey.VISITOR;
        }
    }

}
