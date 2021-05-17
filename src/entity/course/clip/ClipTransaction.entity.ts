import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { LearnerEntity } from "../../profile/learner.entity"
import { ClipEntity } from "./Clip.entity"
import { CoinTransactionEntity } from "../../coins/CoinTransaction.entity"

@Entity("clip_transaction")
export class ClipTransactionEntity {
    @PrimaryGeneratedColumn()
    id: number

    // entity relation
    @ManyToOne(
        () => LearnerEntity,
        (learner) => learner.onlineClips
    )
    @JoinColumn({ name: "learnerId" })
    learner: LearnerEntity

    @ManyToOne(
        () => ClipEntity,
        (clip) => clip.clipTransaction
    )
    @JoinColumn({ name: "clipId" })
    clip: ClipEntity

    @OneToOne(
        () => CoinTransactionEntity,
        (transaction) => transaction.paidClip
    )
    @JoinColumn({ name: "transactionId" })
    transaction: CoinTransactionEntity
}