import { HttpStatus, Injectable } from "@nestjs/common"
import Address from "../../../model/location/Address"
import User from "../../../model/User"
import MeRepository from "../../../repository/MeRepository"
import Profile from "../../../model/profile/Profile"
import { TutorEntity } from "../../../entity/profile/tutor.entity"
import { TutorEntityToTutorProfile } from "../../../utils/mapper/tutor/TutorEntityToTutorProfileMapper"
import { LearnerEntity } from "../../../entity/profile/learner.entity"
import { LearnerEntityToLearnerProfile } from "../../../utils/mapper/learner/LearnerEntityToLearnerProfile"
import { launch } from "../../../core/common/launch"
import { MemberAddressToAddressMapper } from "../../../utils/mapper/location/MemberAddressToAddressMapper"
import UpdateProfileForm from "../../../model/form/update/UpdateProfileForm"
import { FirebaseStorageUtils } from "../../../utils/files/FirebaseStorageUtils"
import { logger } from "../../../core/logging/Logger"
import { isEmpty } from "../../../core/extension/CommonExtension"
import { UserRole } from "../../../core/constant/UserRole"
import FailureResponse from "../../../core/response/FailureResponse"
import UserError from "../../../core/exceptions/constants/user-error.enum"

/**
 * Service for "v1/me"
 * @author oribitalno11 2021 A.D.
 */
@Injectable()
export class MeService {
    constructor(
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
     * Update user profile
     * @param user
     * @param data
     * @param file
     */
    async updateUserProfile(user: User, data: UpdateProfileForm, file?: Express.Multer.File) {
        const firebaseStorageUtils = new FirebaseStorageUtils()
        let newFileUrl: string
        let oldFileUrl: string
        try {
            const userProfile = await this.repository.getUserProfile(user)
            if (isEmpty(userProfile)) {
                logger.error("Can not find user data")
                throw FailureResponse.create(UserError.CAN_NOT_FIND, HttpStatus.NOT_FOUND)
            }

            if (file) {
                oldFileUrl = userProfile.member?.profileUrl
                newFileUrl = await firebaseStorageUtils.uploadImage("profile", userProfile.member?.id, file)
            }

            if (user.role === UserRole.LEARNER && userProfile instanceof LearnerEntity) {
                await this.repository.updateLearnerProfile(data, userProfile, newFileUrl)
            } else if (user.role === UserRole.TUTOR && userProfile instanceof TutorEntity) {
                await this.repository.updateTutorProfile(data, userProfile, newFileUrl)
            } else {
                logger.error("User type is mismatch")
                throw FailureResponse.create(UserError.CAN_NOT_UPDATE)
            }

            if (oldFileUrl) {
                await firebaseStorageUtils.deleteImage(oldFileUrl)
            }
        } catch (error) {
            logger.error(error)
            if (newFileUrl) {
                await firebaseStorageUtils.deleteImage(newFileUrl)
            }
            throw error
        }
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

    getCoinHistory(user: User, tab: number) {

    }
}