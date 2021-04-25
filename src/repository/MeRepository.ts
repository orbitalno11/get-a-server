import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import User from "../model/User"
import { logger } from "../core/logging/Logger"
import { UserRoleKey } from "../core/constant/UserRole"
import { TutorEntity } from "../entity/profile/tutor.entity"
import TutorProfile from "../model/profile/TutorProfile"
import { LearnerEntity } from "../entity/profile/learner.entity"
import LearnerProfile from "../model/profile/LearnerProfile"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { MemberAddressEntity } from "../entity/member/memberAddress.entity"
import ErrorType from "../core/exceptions/model/ErrorType"
import Address from "../model/location/Address"
import { isEmpty } from "../core/extension/CommonExtension"
import { SubDistrictEntity } from "../entity/contact/subDistrict.entity"
import { DistrictEntity } from "../entity/contact/district.entity"
import { ProvinceEntity } from "../entity/contact/province.entity"
import { LocationError } from "../core/exceptions/model/LocationError"
import UserManager from "../utils/UserManager"

/**
 * Repository for "v1/me"
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class MeRepository {
    constructor(
        private readonly connection: Connection,
        private readonly userManager: UserManager) {
    }

    /**
     * Get user profile from simple user data (user id, user role)
     * @param user
     */
    async getUserProfile(user: User): Promise<TutorEntity | LearnerEntity | null> {
        try {
            switch (user.role) {
                case UserRoleKey.TUTOR: {
                    return await this.connection.createQueryBuilder(TutorEntity, "tutor")
                        .leftJoinAndSelect("tutor.member", "member")
                        .leftJoinAndSelect("tutor.contact", "contact")
                        .leftJoinAndSelect("member.memberAddress", "memberAddress")
                        .where("tutor.id like :id")
                        .setParameter("id", TutorProfile.getTutorId(user.id))
                        .getOne()
                }
                case UserRoleKey.LEARNER: {
                    return await this.connection
                        .createQueryBuilder(LearnerEntity, "learner")
                        .leftJoinAndSelect("learner.member", "member")
                        .leftJoinAndSelect("learner.contact", "contact")
                        .where("learner.id like :id")
                        .setParameter("id", LearnerProfile.getLearnerId(user.id))
                        .getOne()
                }
                default: {
                    return null
                }
            }
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get user profile", ErrorType.UNEXPECTED_ERROR)
        }
    }

    /**
     * Get an user address data from user id
     * @param userId
     */
    async getUserAddress(userId: string): Promise<MemberAddressEntity[]> {
        try {
            return await this.connection.createQueryBuilder(MemberAddressEntity, "memberAddress")
                .leftJoinAndSelect("memberAddress.subDistrict", "subDistrict")
                .leftJoinAndSelect("memberAddress.district", "district")
                .leftJoinAndSelect("memberAddress.province", "province")
                .where("memberAddress.member.id like :id", { id: userId })
                .getMany()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get user address list", ErrorType.UNEXPECTED_ERROR)
        }
    }

    /**
     * Crate or update an user address data from data form and user id
     * @param userId
     * @param address
     */
    async updateUserAddress(userId: string, address: Address): Promise<void> {
        try {
            const member = await this.userManager.getMember(userId)
            const addressList = await this.getUserAddress(userId)
            let addressData = addressList.filter(data => data.type === address.type)[0]

            if (isEmpty(addressData)) {
                addressData = new MemberAddressEntity()
            }

            addressData.member = member
            addressData.address = address.address
            addressData.hintAddress = address.hintAddress
            addressData.road = address.road
            addressData.subDistrict = new SubDistrictEntity()
            addressData.subDistrict.id = address.subDistrict.id
            addressData.district = new DistrictEntity()
            addressData.district.id = address.district.id
            addressData.province = new ProvinceEntity()
            addressData.province.id = address.province.id
            addressData.postCode = address.postcode
            addressData.type = address.type
            addressData.latitude = address.geoLocation.latitude
            addressData.longitude = address.geoLocation.longitude

            // update entity
            const queryRunner = this.connection.createQueryRunner()
            try {
                await queryRunner.connect()
                await queryRunner.startTransaction()
                await queryRunner.manager.save(addressData)
                await queryRunner.commitTransaction()
            } catch (error) {
                logger.error(error)
                await queryRunner.rollbackTransaction()
                throw ErrorExceptions.create("Can not update address", LocationError.CAN_NOT_UPDATE)
            } finally {
                await queryRunner.release()
            }

        } catch (error) {
            logger.error(error)
            if (error instanceof ErrorExceptions) throw error
            throw ErrorExceptions.create("Can not update user addree", ErrorType.UNEXPECTED_ERROR)
        }
    }
}

export default MeRepository