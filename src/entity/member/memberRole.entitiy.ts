import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MemberEntity } from './member.entitiy';
import { RoleEntity } from '../common/role.entity';

@Entity('member_role')
export class MemberRoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RoleEntity, (role) => role.memberRole)
  @JoinColumn()
  role: RoleEntity;

  @OneToOne(() => MemberEntity)
  @JoinColumn()
  member: MemberEntity;
}
