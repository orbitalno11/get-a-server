import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { TutorEntity } from '../profile/tutor.entity'
import { BranchEntity } from './branch.entity'
import { InstituteEntity } from './institute.entity'

@Entity('education_history')
export class EducationHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  gpax: number

  @Column()
  status: string

  // entity relation
  @ManyToOne(() => TutorEntity, (tutor) => tutor.educationHistory)
  @JoinColumn({ name: 'tutorId' })
  tutor: TutorEntity

  @ManyToOne(() => InstituteEntity, (institute) => institute.educationHistory)
  @JoinColumn({ name: 'instituteId' })
  institute: InstituteEntity

  @ManyToOne(() => BranchEntity, (branch) => branch.educationHistory)
  @JoinColumn({ name: 'branchId' })
  branch: BranchEntity
}