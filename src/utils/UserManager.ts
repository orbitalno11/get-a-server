import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { auth } from "firebase-admin"
import { Repository } from "typeorm"
import { authentication } from "../configs/FirebaseConfig"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import UserErrorType from "../core/exceptions/model/UserErrorType"
import { logger } from "../core/logging/Logger"
import { MemberEntity } from "../entity/member/member.entitiy"
import { MemberRoleEntity } from "../entity/member/memberRole.entitiy"
import Register from "../model/form/register/Register"
import User from "../model/User"
import MemberEntityToUserMapper from "./mapper/MemberEnityToUserMapper"

@Injectable()
class UserManager {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>
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

      const user = MemberEntityToUserMapper(data, data.memberRole.id)
      return user
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
}

export default UserManager
