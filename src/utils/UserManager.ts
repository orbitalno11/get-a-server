import {Injectable} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm"
import {auth} from "firebase-admin"
import {Repository} from "typeorm"
import {authentication} from "../configs/FirebaseConfig"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import UserErrorType from "../core/exceptions/model/UserErrorType"
import {logger} from "../core/logging/Logger"
import {MemberEntity} from "../entity/member/member.entitiy"
import Register from "../model/form/register/Register"
import User from "../model/User"
import {MemberEntityToUserMapper} from "./mapper/member/MemberEnityToUserMapper"
import {TutorEntity} from "../entity/profile/tutor.entity";
import {LearnerEntity} from "../entity/profile/learner.entity";
import {isEmpty} from "../core/extension/CommonExtension";
import TutorProfile from "../model/profile/TutorProfile";
import LearnerProfile from "../model/profile/LearnerProfile";

@Injectable()
class UserManager {
    constructor(
        @InjectRepository(MemberEntity)
        private readonly memberRepository: Repository<MemberEntity>,
        @InjectRepository(TutorEntity)
        private readonly tutorRepository: Repository<TutorEntity>,
        @InjectRepository(LearnerEntity)
        private readonly learnerRepository: Repository<LearnerEntity>
    ) {
    }

    public async createUser(registerData: Register): Promise<auth.UserRecord> {
        try {
            return await authentication.createUser({
                email: registerData.email,
                password: registerData.password
            })
        } catch (error) {
            if (error["code"] === "auth/email-already-exists") {
                throw new ErrorExceptions(error, UserErrorType.EMAIL_ALREDY_EXITS)
            }
            throw new ErrorExceptions(
                "Can not create user",
                UserErrorType.CAN_NOT_CREATE_USER
            )
        }
    }

    public async getUser(userId: string): Promise<User> {
        try {
            const data = await this.memberRepository
                .createQueryBuilder("member")
                .leftJoinAndSelect("member.memberRole", "memberRole")
                .leftJoinAndSelect("memberRole.role", "role")
                .where("member.id like :id")
                .setParameter("id", userId)
                .getOne()

            return new MemberEntityToUserMapper(data.memberRole.role.id).map(data)
        } catch (error) {
            logger.error(error)
            throw new ErrorExceptions(
                "Can not find user",
                UserErrorType.CAN_NOT_FIND_USER
            )
        }
    }

    public async editUserEmail(
        userId: string,
        newEmail: string
    ): Promise<auth.UserRecord> {
        try {
            return await authentication.updateUser(userId, {
                email: newEmail
            })
        } catch (error) {
            logger.error(error)
            throw new ErrorExceptions(
                "Cannot update user email",
                UserErrorType.CANNOT_UPDATE_USER_EMAIL
            )
        }
    }

    public async deleteUser(userId: string | null): Promise<boolean> {
        try {
            if (userId.isSafeNotNull()) {
                await authentication.deleteUser(userId)
                return true
            } else {
                throw ErrorExceptions.create("Can not foud delete user id", UserErrorType.CANNOT_DELETE_USER)
            }
        } catch (error) {
            logger.error(error)
            if (error instanceof ErrorExceptions) throw error
            throw new ErrorExceptions(
                "Cannot delete user",
                UserErrorType.CANNOT_DELETE_USER
            )
        }
    }

    public async getMember(userId: string): Promise<MemberEntity> {
        try {
            if (!userId?.isSafeNotBlank()) {
                logger.error("Can not found user id")
                throw ErrorExceptions.create("Can not find user id", UserErrorType.CAN_NOT_FOUND_USER_ID)
            }

            const member = await this.memberRepository.findOne(userId)

            if (isEmpty(member)) {
                throw ErrorExceptions.create("Can not find user", UserErrorType.CAN_NOT_FIND_USER)
            }

            return member
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    public async getTutor(userId: string): Promise<TutorEntity> {
        try {
            if(!userId?.isSafeNotNull()) {
                logger.error("Can not found user id")
                throw ErrorExceptions.create("Can not find user id", UserErrorType.CAN_NOT_FOUND_USER_ID)
            }

            const tutorProfile = await this.tutorRepository.findOne(TutorProfile.getTutorId(userId))

            if (isEmpty(tutorProfile)) {
                throw ErrorExceptions.create("Can not find user", UserErrorType.CAN_NOT_FIND_USER)
            }

            return tutorProfile
        } catch (error) {
            logger.error(error)
            if (error instanceof ErrorExceptions) throw error
            throw error
        }
    }

    public async getLearner(userId: string): Promise<LearnerEntity> {
        try {
            if(!userId?.isSafeNotNull()) {
                logger.error("Can not found user id")
                throw ErrorExceptions.create("Can not find user id", UserErrorType.CAN_NOT_FOUND_USER_ID)
            }

            const learnerProfile = await this.learnerRepository.findOne(LearnerProfile.getLearnerId(userId))

            if (isEmpty(learnerProfile)) {
                throw ErrorExceptions.create("Can not find user", UserErrorType.CAN_NOT_FIND_USER)
            }

            return learnerProfile
        } catch (error) {
            logger.error(error)
            if (error instanceof ErrorExceptions) throw error
            throw error
        }
    }
}

export default UserManager
