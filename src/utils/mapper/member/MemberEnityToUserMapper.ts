import { UserRoleKey } from '../../../core/constant/UserRole';
import { MemberEntity } from '../../../entity/member/member.entitiy';
import User from '../../../model/User';

const getUserRole = (roleId: number): UserRoleKey => {
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
};

const MemberEntityToUserMapper = (from: MemberEntity, role: number): User => ({
  id: from.id,
  username: from.username,
  email: from.email,
  profileUrl: from.profileUrl,
  role: getUserRole(role),
});

export default MemberEntityToUserMapper;
