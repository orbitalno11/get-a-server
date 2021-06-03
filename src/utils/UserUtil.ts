import { Injectable } from "@nestjs/common"
import { auth } from "firebase-admin"
import { authentication } from "../configs/FirebaseConfig"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import UserError from "../core/exceptions/constants/user-error.enum"
import { logger } from "../core/logging/Logger"
import Register from "../model/form/register/Register"
import User from "../model/User"
import { MemberEntityToUserMapper } from "./mapper/member/MemberEnityToUserMapper"
import { TutorEntity } from "../entity/profile/tutor.entity"
import { LearnerEntity } from "../entity/profile/learner.entity"
import { isEmpty, isNotEmpty } from "../core/extension/CommonExtension"
import TutorProfile from "../model/profile/TutorProfile"
import LearnerProfile from "../model/profile/LearnerProfile"
import UserRepository from "../repository/UserRepository"
import CommonError from "../core/exceptions/constants/common-error.enum"
import { launch } from "../core/common/launch"
import { OfflineCourseEntity } from "../entity/course/offline/offlineCourse.entity"
import { OfflineCourseRatingTransactionEntity } from "../entity/course/offline/offlineCourseRatingTransaction.entity"
import { FavoriteTutorEntity } from "../entity/favoriteTutor.entity"
import { OnlineCourseEntity } from "../entity/course/online/OnlineCourse.entity"
import { CoinEntity } from "../entity/coins/coin.entity"
import { ClipTransactionEntity } from "../entity/course/clip/ClipTransaction.entity"
import { ClipRatingTransactionEntity } from "../entity/course/clip/ClipRatingTransaction.entity"
import { ClipEntity } from "../entity/course/clip/Clip.entity"

/**
 * User utility class
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class UserUtil {
    constructor(private readonly userRepository: UserRepository) {
    }

    /**
     * Create firebase user
     * @param registerData
     */
    async createFirebaseUser(registerData: Register): Promise<auth.UserRecord> {
        try {
            return await authentication.createUser({
                email: registerData.email,
                password: registerData.password
            })
        } catch (error) {
            if (error["code"] === "auth/email-already-exists") {
                throw new ErrorExceptions(error, UserError.EMAIL_ALREADY_EXITS)
            }
            throw new ErrorExceptions(
                "Can not create user",
                UserError.CAN_NOT_CREATE
            )
        }
    }

    /**
     * Edit firebase user email
     * @param userId
     * @param email
     */
    async editFirebaseUserEmail(
        userId: string,
        email: string
    ): Promise<auth.UserRecord> {
        try {
            if (userId?.isSafeNotBlank() && email?.isSafeNotBlank()) {
                return await authentication.updateUser(userId, {
                    email: email
                })
            } else {
                logger.error("Update data is invalid")
                throw ErrorExceptions.create("Update data is invalid", CommonError.INVALID_REQUEST_DATA)
            }
        } catch (error) {
            logger.error(error)
            if (error instanceof ErrorExceptions) throw error
            throw new ErrorExceptions(
                "Cannot update user email",
                UserError.CAN_NOT_UPDATE_EMAIL
            )
        }
    }

    /**
     * Delete firebase user
     * @param userId
     */
    async deleteFirebaseUser(userId: string | null): Promise<boolean> {
        try {
            if (userId.isSafeNotNull()) {
                await authentication.deleteUser(userId)
                return true
            } else {
                throw ErrorExceptions.create("Can not found delete user id", UserError.CAN_NOT_DELETE)
            }
        } catch (error) {
            logger.error(error)
            if (error instanceof ErrorExceptions) throw error
            throw new ErrorExceptions(
                "Cannot delete user",
                UserError.CAN_NOT_DELETE
            )
        }
    }

    /**
     * Check user already verify account
     * @param userId
     */
    isVerified(userId: string): Promise<boolean> {
        return launch(async () => {
            const member = await this.userRepository.getUserWithRole(userId)
            return member.verified
        })
    }

    /**
     * Get basic user data (member, role)
     * @param userId
     */
    getBaseUser(userId: string): Promise<User> {
        return launch(async () => {
            if (!userId?.isSafeNotBlank()) {
                logger.error("Can not found user id")
                throw ErrorExceptions.create("Can not found user id", UserError.CAN_NOT_FOUND_ID)
            }

            const member = await this.userRepository.getUserWithRole(userId)

            if (isEmpty(member)) {
                logger.error("Can not found user")
                throw ErrorExceptions.create("Can not found user", UserError.CAN_NOT_FIND)
            }

            return new MemberEntityToUserMapper(member.memberRole.role.id).map(member)
        })
    }

    /**
     * Get tutor entity from user id
     * @param userId
     */
    getTutor(userId: string): Promise<TutorEntity> {
        return launch(async () => {
            if (!userId?.isSafeNotNull()) {
                logger.error("Can not found user id")
                throw ErrorExceptions.create("Can not find user id", UserError.CAN_NOT_FOUND_ID)
            }

            const tutor = await this.userRepository.getTutor(TutorProfile.getTutorId(userId))

            if (isEmpty(tutor)) {
                throw ErrorExceptions.create("Can not find user", UserError.CAN_NOT_FIND)
            }

            return tutor
        })
    }

    /**
     * Get learner entity from user id
     * @param userId
     */
    getLearner(userId: string): Promise<LearnerEntity> {
        return launch(async () => {
            if (!userId?.isSafeNotNull()) {
                logger.error("Can not found user id")
                throw ErrorExceptions.create("Can not find user id", UserError.CAN_NOT_FOUND_ID)
            }

            const learner = await this.userRepository.getLearner(LearnerProfile.getLearnerId(userId))

            if (isEmpty(learner)) {
                throw ErrorExceptions.create("Can not find user", UserError.CAN_NOT_FIND)
            }

            return learner
        })
    }

    /**
     * Check the request user is a course owner
     * @param userId
     * @param courseId
     * @param isOfflineCourse
     */
    isCourseOwner(userId: string, courseId: string, isOfflineCourse: boolean = true): Promise<boolean> {
        return launch(async () => {
            if (userId?.isSafeNotBlank() && courseId?.isSafeNotBlank()) {
                const course = await this.getCourseOwn(userId, courseId, isOfflineCourse)
                return isNotEmpty(course)
            } else {
                throw ErrorExceptions.create("Query data is invalid", CommonError.INVALID_REQUEST_DATA)
            }
        })
    }

    /**
     * Get course data if user is an owner
     * @param userId
     * @param courseId
     * @param isOfflineCourse
     */
    getCourseOwn(userId: string, courseId: string, isOfflineCourse: boolean = true): Promise<OfflineCourseEntity | OnlineCourseEntity | null> {
        return launch(async () => {
            if (userId?.isSafeNotBlank() && courseId?.isSafeNotBlank()) {
                return await this.userRepository.getOwnCourseById(TutorProfile.getTutorId(userId), courseId, isOfflineCourse)
            } else {
                throw ErrorExceptions.create("Query data is invalid", CommonError.INVALID_REQUEST_DATA)
            }
        })
    }

    /**
     * Check the request learner enrolled course
     * @param userId
     * @param courseId
     * @param isOfflineCourse
     */
    isEnrolled(userId: string, courseId: string, isOfflineCourse: boolean = true): Promise<boolean> {
        return launch(async () => {
            if (userId?.isSafeNotBlank() && courseId?.isSafeNotBlank()) {
                return await this.userRepository.isEnrolledCourseById(LearnerProfile.getLearnerId(userId), courseId, isOfflineCourse)
            } else {
                throw ErrorExceptions.create("Query data is invalid", CommonError.INVALID_REQUEST_DATA)
            }
        })
    }

    /**
     * Get enrolled course detail
     * @param userId
     * @param courseId
     * @param isOfflineCourse
     */
    getEnrolled(userId: string, courseId: string, isOfflineCourse: boolean = true): Promise<OfflineCourseEntity | OnlineCourseEntity> {
        return launch(async () => {
            if (userId?.isSafeNotBlank() && courseId?.isSafeNotBlank()) {
                return await this.userRepository.getEnrolledCourseById(LearnerProfile.getLearnerId(userId), courseId, isOfflineCourse)
            } else {
                throw ErrorExceptions.create("Query data is invalid", CommonError.INVALID_REQUEST_DATA)
            }
        })
    }

    /**
     * Check request learner is already subscribe clip
     * @param userId
     * @param clipId
     */
    isSubscribeClip(userId: string, clipId: string): Promise<boolean> {
        return launch(async () => {
            if (userId?.isSafeNotBlank() && clipId?.isSafeNotBlank()) {
                return await this.userRepository.isSubscribeClipById(LearnerProfile.getLearnerId(userId), clipId)
            } else {
                throw ErrorExceptions.create("Query data is invalid", CommonError.INVALID_REQUEST_DATA)
            }
        })
    }

    /**
     * Get learner subscribe clip detail
     * @param userId
     * @param clipId
     */
    getSubscribeClip(userId: string, clipId: string): Promise<ClipEntity> {
        return launch(async () => {
            if (userId?.isSafeNotBlank() && clipId?.isSafeNotBlank()) {
                return await this.userRepository.getSubscribeClipById(LearnerProfile.getLearnerId(userId), clipId)
            } else {
                throw ErrorExceptions.create("Query data is invalid", CommonError.INVALID_REQUEST_DATA)
            }
        })
    }

    /**
     * Check the request learner reviewed course
     * @param userId
     * @param courseId
     */
    isReviewCourse(userId: string, courseId: string): Promise<boolean> {
        return launch(async () => {
            if (userId?.isSafeNotBlank() && courseId?.isSafeNotBlank()) {
                return await this.userRepository.isReviewCourseById(LearnerProfile.getLearnerId(userId), courseId)
            } else {
                throw ErrorExceptions.create("Query data is invalid", CommonError.INVALID_REQUEST_DATA)
            }
        })
    }

    /**
     * Get review detail
     * @param userId
     * @param courseId
     */
    getCourseReview(userId: string, courseId: string): Promise<OfflineCourseRatingTransactionEntity> {
        return launch(async () => {
            if (userId?.isSafeNotBlank() && courseId?.isSafeNotBlank()) {
                return await this.userRepository.getReviewCourseById(LearnerProfile.getLearnerId(userId), courseId)
            } else {
                throw ErrorExceptions.create("Query data is invalid", CommonError.INVALID_REQUEST_DATA)
            }
        })
    }

    /**
     * Check the request learner reviewed clip
     * @param userId
     * @param clipId
     */
    isReviewClip(userId: string, clipId: string): Promise<boolean> {
        return launch(async () => {
            if (userId?.isSafeNotBlank() && clipId?.isSafeNotBlank()) {
                const review = await this.getClipReview(userId, clipId)
                return isNotEmpty(review)
            } else {
                throw ErrorExceptions.create("Query data is invalid", CommonError.INVALID_REQUEST_DATA)
            }
        })
    }

    /**
     * Get clip review detail
     * @param userId
     * @param clipId
     */
    getClipReview(userId: string, clipId: string): Promise<ClipRatingTransactionEntity> {
        return launch(async () => {
            if (userId?.isSafeNotBlank() && clipId?.isSafeNotBlank()) {
                return await this.userRepository.getReviewClipById(LearnerProfile.getLearnerId(userId), clipId)
            } else {
                throw ErrorExceptions.create("Query data is invalid", CommonError.INVALID_REQUEST_DATA)
            }
        })
    }

    /**
     * Check learner is already like tutor by tutor id
     * @param learnerId
     * @param tutorId
     */
    isLiked(learnerId: string, tutorId: string): Promise<boolean> {
        return launch(async () => {
            if (learnerId?.isSafeNotBlank() && tutorId?.isSafeNotBlank()) {
                const result = await this.getFavoriteTutor(learnerId, tutorId)
                return isNotEmpty(result)
            } else {
                throw ErrorExceptions.create("Query data is invalid", CommonError.INVALID_REQUEST_DATA)
            }
        })
    }

    /**
     * Get favorite tutor by learner id and tutor id
     * @param learnerId
     * @param tutorId
     */
    getFavoriteTutor(learnerId: string, tutorId: string): Promise<FavoriteTutorEntity> {
        return launch(async () => {
            if (learnerId?.isSafeNotBlank() && tutorId?.isSafeNotBlank()) {
                return await this.userRepository.getFavoriteTutor(
                    LearnerProfile.getLearnerId(learnerId),
                    TutorProfile.getTutorId(tutorId)
                )
            } else {
                throw ErrorExceptions.create("Query data is invalid", CommonError.INVALID_REQUEST_DATA)
            }
        })
    }

    /**
     * Get user coin balance
     * @param userId
     */
    getCoinBalance(userId: string): Promise<CoinEntity> {
        return launch(async () => {
            if (userId?.isSafeNotBlank()) {
                return await this.userRepository.getCoinBalance(userId)
            } else {
                throw ErrorExceptions.create("Query data is invalid", CommonError.INVALID_REQUEST_DATA)
            }
        })
    }

    /**
     * Check request user is already buy the clip
     * @param userId
     * @param clipId
     */
    isBoughtClip(userId: string, clipId: string): Promise<boolean> {
        return launch(async () => {
            if (userId?.isSafeNotBlank() && clipId?.isSafeNotBlank()) {
                const clip = await this.getBoughtClip(userId, clipId)
                return isNotEmpty(clip)
            } else {
                throw ErrorExceptions.create("Query data is invalid", CommonError.INVALID_REQUEST_DATA)
            }
        })
    }

    /**
     * Get bought clip transaction entity by learner and clip id
     * @param userId
     * @param clipId
     */
    getBoughtClip(userId: string, clipId: string): Promise<ClipTransactionEntity> {
        return launch(async () => {
            if (userId?.isSafeNotBlank() && clipId?.isSafeNotBlank()) {
                return await this.userRepository.getBoughtClip(LearnerProfile.getLearnerId(userId), clipId)
            } else {
                throw ErrorExceptions.create("Query data is invalid", CommonError.INVALID_REQUEST_DATA)
            }
        })
    }

}

export default UserUtil
