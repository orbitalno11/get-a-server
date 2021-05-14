import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { LearnerEntity } from "./profile/learner.entity"
import { TutorEntity } from "./profile/tutor.entity"

@Entity("favorite_tutor")
export class FavoriteTutorEntity {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => LearnerEntity, (learner) => learner.favoriteTutor)
    @JoinColumn({ name: "ownerId" })
    learner: LearnerEntity

    @ManyToOne(() => TutorEntity, (tutor) => tutor.wasFavoriteBy)
    @JoinColumn({ name: "tutorId" })
    tutor: TutorEntity
}