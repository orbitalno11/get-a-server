import {Injectable} from "@nestjs/common"
import {Connection} from "typeorm"
import Address from "../../../model/location/Address"
import {logger} from "../../../core/logging/Logger"
import UserManager from "../../../utils/UserManager"
import {MemberAddressEntity} from "../../../entity/member/memberAddress.entity"
import {isEmpty} from "../../../core/extension/CommonExtension"
import {SubDistrictEntity} from "../../../entity/contact/subDistrict.entity"
import {DistrictEntity} from "../../../entity/contact/district.entity"
import {ProvinceEntity} from "../../../entity/contact/province.entity"
import ErrorExceptions from "../../../core/exceptions/ErrorExceptions"
import {LocationError} from "../../../core/exceptions/model/LocationError"
import User from "../../../model/User"
import MeRepository from "../../../repository/MeRepository"
import Profile from "../../../model/profile/Profile"
import {TutorEntity} from "../../../entity/profile/tutor.entity"
import {TutorEntityToTutorProfile} from "../../../utils/mapper/tutor/TutorEntityToTutorProfileMapper"
import {LearnerEntity} from "../../../entity/profile/learner.entity"
import {LearnerEntityToLearnerProfile} from "../../../utils/mapper/learner/LearnerEntityToLearnerProfile"
import {launch} from "../../../core/common/launch"

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
    async getUserProfile(user: User): Promise<Profile | null> {
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
    async getUserAddress(userId: string): Promise<MemberAddressEntity[]> {
        try {
            return await this.connection.createQueryBuilder(MemberAddressEntity, "memberAddress")
                .leftJoinAndSelect("memberAddress.subDistrict", "subDistrict")
                .leftJoinAndSelect("memberAddress.district", "district")
                .leftJoinAndSelect("memberAddress.province", "province")
                .where("memberAddress.member.id like :id", {id: userId})
                .getMany()
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    /**
     * Crate or update an user address data from data form and user id
     * @param userId
     * @param address
     */
    async updateUserAddress(userId: string, address: Address) {
        try {
            const member = await this.userManger.getMember(userId)
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
            throw error
        }
    }
}