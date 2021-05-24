import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { ClipEntity } from "./Clip.entity"

@Entity("online_clip_rating")
export class ClipRatingEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    reviewNumber: number

    @Column()
    rating: number

    // entity relation
    @OneToOne(
        () => ClipEntity,
        (clip) => clip.rating
    )
    @JoinColumn({ name: "clipId" })
    clip: ClipEntity

}