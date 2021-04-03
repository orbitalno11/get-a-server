import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { InterestedSubjectEntity } from './interestedSubject.entity'
import { MemberRoleEntity } from './memberRole.entitiy'
import { TutorEntity } from '../profile/tutor.entity'
import { MemberAddressEntity } from './memberAddress.entity'
import { CoinEntity } from '../coins/coin.entity'
import { ExchangeTransactionEntity } from '../coins/exchangeTransaction.entity'
import { LearnerEntity } from '../profile/learner.entity'

@Entity('member')
export class MemberEntity {
  @PrimaryColumn()
  id: string

  @Column()
  firstname: string

  @Column()
  lastname: string

  @Column()
  gender: number

  @Column()
  dateOfBirth: Date

  @Column()
  profileUrl: string

  @Column()
  email: string

  @Column()
  username: string

  @UpdateDateColumn()
  updated: Date | null

  @CreateDateColumn({ default: new Date() })
  created: Date | null

  // entity relation
  @OneToOne(
    () => TutorEntity,
    (tutor) => tutor.member,
    { cascade: true }
  )
  tutorProfile: TutorEntity

  @OneToOne(
    () => LearnerEntity,
    (learner) => learner.member,
    { cascade: true }
  )
  leanerProfile: LearnerEntity

  @OneToOne(
    () => MemberRoleEntity,
    memberRole => memberRole.member,
    { cascade: true }
  )
  memberRole: MemberRoleEntity

  @OneToMany(
    () => InterestedSubjectEntity,
    (interested) => interested.member,
    { cascade: true }
  )
  interestedSubject: InterestedSubjectEntity[]

  @OneToMany(
    () => MemberAddressEntity,
    (memberAddress) => memberAddress.member,
    { cascade: true }
  )
  memberAddress: MemberAddressEntity[]

  @OneToOne(() => CoinEntity, (coin) => coin.member)
  coins: CoinEntity

  @OneToMany(() => ExchangeTransactionEntity, (transaction) => transaction.member)
  exchangeTransaction: ExchangeTransactionEntity[]
}