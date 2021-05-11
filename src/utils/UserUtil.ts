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
import { isEmpty } from "../core/extension/CommonExtension"
import TutorProfile from "../model/profile/TutorProfile"
import LearnerProfile from "../model/profile/LearnerProfile"
import { UserRepository } from "../repository/UserRepository"
import CommonError from "../core/exceptions/constants/common-error.enum"
import { launch } from "../core/common/launch"

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
     * Get basic user data (member, role)
     * @param userId
     */
    async getBaseUser(userId: string): Promise<User> {
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
    async getTutor(userId: string): Promise<TutorEntity> {
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
    async getLearner(userId: string): Promise<LearnerEntity> {
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
    async isCourseOwner(userId: string, courseId: string, isOfflineCourse: boolean = true): Promise<boolean> {
        return launch(async () => {
            if (userId?.isSafeNotBlank() && courseId?.isSafeNotBlank()) {
                const course = await this.userRepository.getOwnCourseById(TutorProfile.getTutorId(userId), courseId, isOfflineCourse)
                return isEmpty(course)
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
    async isEnrolled(userId: string, courseId: string, isOfflineCourse: boolean = true): Promise<boolean> {
        return launch(async () => {
            if (userId?.isSafeNotBlank() && courseId?.isSafeNotBlank()) {
                const course = await this.userRepository.getEnrolledCourseById(LearnerProfile.getLearnerId(userId), courseId, isOfflineCourse)
                return isEmpty(course)
            } else {
                throw ErrorExceptions.create("Query data is invalid", CommonError.INVALID_REQUEST_DATA)
            }
        })
    }
}

export default UserUtil
