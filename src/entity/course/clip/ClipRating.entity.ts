import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { ClipEntity } from "./Clip.entity"

// TODO Remove this class and use ClipStatistic
@Entity("online_clip_rating")
export class ClipRatingEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    rating: number

    @Column({ name: "reviewNumber" })
    reviewNumber: number

    // entity relation
    @OneToOne(
        () => ClipEntity,
        (clip) => clip.rating
    )
    @JoinColumn({ name: "clip_id" })
    clip: ClipEntity
}