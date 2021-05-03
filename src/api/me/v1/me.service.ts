import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import Address from "../../../model/location/Address"
import UserManager from "../../../utils/UserManager"
import User from "../../../model/User"
import MeRepository from "../../../repository/MeRepository"
import Profile from "../../../model/profile/Profile"
import { TutorEntity } from "../../../entity/profile/tutor.entity"
import { TutorEntityToTutorProfile } from "../../../utils/mapper/tutor/TutorEntityToTutorProfileMapper"
import { LearnerEntity } from "../../../entity/profile/learner.entity"
import { LearnerEntityToLearnerProfile } from "../../../utils/mapper/learner/LearnerEntityToLearnerProfile"
import { launch } from "../../../core/common/launch"
import { MemberAddressToAddressMapper } from "../../../utils/mapper/location/MemberAddressToAddressMapper"

/**
 * Service for "v1/me"
 * @author oribitalno11 2021 A.D.
 */
@Injectable()
export class MeService {
    constructor(
        private readonly connection: Connection,
        private readonly userManger: UserManager,
        private readonly repository: MeRepository
    ) {
    }

    /**
     * Get user profile from user id and role
     * @param user
     */
    getUserProfile(user: User): Promise<Profile | null> {
        return launch(async () => {
            const result = await this.repository.getUserProfile(user)
            if (result instanceof TutorEntity) {
                return new TutorEntityToTutorProfile().map(result)
            } else if (result instanceof LearnerEntity) {
                return LearnerEntityToLearnerProfile(result)
            } else {
                return null
            }
        })
    }

    /**
     * Get an user address data from user id
     * @param userId
     */
    getUserAddress(userId: string): Promise<Address[]> {
        return launch(async () => {
            const result = await this.repository.getUserAddress(userId)
            return result.map(data => MemberAddressToAddressMapper(data))
        })
    }

    /**
     * Crate or update an user address data from data form and user id
     * @param userId
     * @param address
     */
    updateUserAddress(userId: string, address: Address): Promise<void> {
        return launch(async () => {
            await this.repository.updateUserAddress(userId, address)
        })
    }
}