import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('contact')
export class ContactEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  phoneNumber: string

  @Column()
  lineId: string

  @Column()
  facebookUrl: string

  // entity relation
  // @OneToOne(
  //   () => TutorEntity,
  //   (update-profile) => update-profile.contact,
  //   { cascade: true } 
  // )
  // update-profile: TutorEntity
}