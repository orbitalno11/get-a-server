import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { MemberRoleEntity } from '../member/memberRole.entitiy';

@Entity('role')
export class RoleEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  title: string;

  // entity relation
  @OneToMany(() => MemberRoleEntity, (memberRole) => memberRole.role)
  memberRole: MemberRoleEntity[];

  // static method
  public static create(id: number, title: string): RoleEntity {
    const role = new RoleEntity();
    role.id = id
    role.title = title
    return role
  }

  public static createFromId(id: number): RoleEntity {
    const role = new RoleEntity();
    role.id = id
    return role
  }
}
