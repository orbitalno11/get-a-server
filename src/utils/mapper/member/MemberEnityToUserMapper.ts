import {UserRole} from '../../../core/constant/UserRole';
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
        user.verified = from.verified
        return user
    }

    private getUserRole(roleId: number): UserRole {
        switch (roleId) {
            case 0:
                return UserRole.ADMIN;
            case 1:
                return UserRole.LEARNER;
            case 2:
                return UserRole.TUTOR;
            case 3:
                return UserRole.TUTOR_LEARNER;
            default:
                return UserRole.VISITOR;
        }
    }

}
