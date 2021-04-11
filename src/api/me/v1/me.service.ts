import {Injectable} from "@nestjs/common";
import {Connection} from "typeorm";
import Address from "../../../model/location/Address";
import {logger} from "../../../core/logging/Logger";
import UserManager from "../../../utils/UserManager";
import {MemberAddressEntity} from "../../../entity/member/memberAddress.entity";
import {isEmpty} from "../../../core/extension/CommonExtension";
import {SubDistrictEntity} from "../../../entity/contact/subDistrict.entity";
import {DistrictEntity} from "../../../entity/contact/district.entity";
import {ProvinceEntity} from "../../../entity/contact/province.entity";
import ErrorExceptions from "../../../core/exceptions/ErrorExceptions";
import {LocationError} from "../../../core/exceptions/model/LocationError";

/**
 * @author oribitalno11 2021 A.D.
 */
@Injectable()
export class MeService {
    constructor(
        private readonly connection: Connection,
        private readonly userManger: UserManager
    ) {
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