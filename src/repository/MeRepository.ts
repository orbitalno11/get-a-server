import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import User from "../model/User"
import { logger } from "../core/logging/Logger"
import { UserRole } from "../core/constant/UserRole"
import { TutorEntity } from "../entity/profile/tutor.entity"
import TutorProfile from "../model/profile/TutorProfile"
import { LearnerEntity } from "../entity/profile/learner.entity"
import LearnerProfile from "../model/profile/LearnerProfile"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { MemberAddressEntity } from "../entity/member/memberAddress.entity"
import CommonError from "../core/exceptions/constants/common-error.enum"
import Address from "../model/location/Address"
import { isEmpty } from "../core/extension/CommonExtension"
import { SubDistrictEntity } from "../entity/contact/subDistrict.entity"
import { DistrictEntity } from "../entity/contact/district.entity"
import { ProvinceEntity } from "../entity/contact/province.entity"
import { LocationError } from "../core/exceptions/constants/location-error.enum"
import UserError from "../core/exceptions/constants/user-error.enum"
import UpdateProfileForm from "../model/form/update/UpdateProfileForm"
import { ContactEntity } from "../entity/contact/contact.entitiy"
import { MemberEntity } from "../entity/member/member.entitiy"
import { GradeEntity } from "../entity/common/grade.entity"
import { CoinEntity } from "../entity/coins/coin.entity"
import { CoinTransactionEntity } from "../entity/coins/CoinTransaction.entity"
import { CoinError } from "../core/exceptions/constants/coin.error"
import { ExchangeTransactionEntity } from "../entity/coins/exchangeTransaction.entity"
import { UserVerifyEntity } from "../entity/UserVerify.entity"
import { UserVerify } from "../model/common/data/UserVerify.enum"
import { VerificationError } from "../core/exceptions/constants/verification-error.enum"

/**
 * Repository for "v1/me"
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class MeRepository {
    constructor(
        private readonly connection: Connection) {
    }

    /**
     * Get user profile from simple user data (user id, user role)
     * @param user
     */
    async getUserProfile(user: User): Promise<TutorEntity | LearnerEntity | null> {
        try {
            switch (user.role) {
                case UserRole.TUTOR: {
                    return await this.connection.createQueryBuilder(TutorEntity, "tutor")
                        .leftJoinAndSelect("tutor.member", "member")
                        .leftJoinAndSelect("tutor.contact", "contact")
                        .leftJoinAndSelect("member.memberAddress", "memberAddress")
                        .where("tutor.id like :id")
                        .setParameter("id", TutorProfile.getTutorId(user.id))
                        .getOne()
                }
                case UserRole.LEARNER: {
                    return await this.connection
                        .createQueryBuilder(LearnerEntity, "learner")
                        .leftJoinAndSelect("learner.member", "member")
                        .leftJoinAndSelect("learner.contact", "contact")
                        .leftJoinAndSelect("learner.grade", "grade")
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
            throw ErrorExceptions.create("Can not get user profile", UserError.CAN_NOT_FIND)
        }
    }

    /**
     * Update learner profile
     * @param updateData
     * @param userProfile
     * @param pictureUrl
     */
    async updateLearnerProfile(updateData: UpdateProfileForm, userProfile: LearnerEntity, pictureUrl?: string) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            // update contact
            const contact = this.createContactEntity(updateData, userProfile)

            // update learner data
            const learnerProfile = new LearnerEntity()
            learnerProfile.id = userProfile.id
            learnerProfile.grade = GradeEntity.createFromGrade(updateData.grade)
            learnerProfile.contact = contact

            // update member data
            const member = this.createMemberEntity(updateData, userProfile, pictureUrl)
            member.leanerProfile = learnerProfile

            await this.saveUserData(member, contact)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not update learner profile", UserError.CAN_NOT_UPDATE)
        }
    }

    /**
     * Update tutor profile
     * @param updateData
     * @param userProfile
     * @param pictureUrl
     */
    async updateTutorProfile(updateData: UpdateProfileForm, userProfile: TutorEntity, pictureUrl?: string) {
        try {
            // update contact data
            const contact = this.createContactEntity(updateData, userProfile)

            // update tutor profile data
            const tutorProfile = new TutorEntity()
            tutorProfile.id = userProfile.id
            tutorProfile.introduction = updateData.introduction?.isSafeNotBlank() ? updateData.introduction : userProfile.introduction
            tutorProfile.contact = contact

            // update member data
            const member = this.createMemberEntity(updateData, userProfile, pictureUrl)
            member.tutorProfile = tutorProfile

            await this.saveUserData(member, contact)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not update tutor profile", UserError.CAN_NOT_UPDATE)
        }
    }

    /**
     * Create contact entity with update data
     * @param updateData
     * @param userProfile
     * @private
     */
    private createContactEntity(
        updateData: UpdateProfileForm,
        userProfile: LearnerEntity | TutorEntity
    ): ContactEntity {
        const contact = new ContactEntity()
        contact.id = userProfile.contact.id
        contact.phoneNumber = updateData.phoneNumber
        contact.lineId = updateData.lineId?.isSafeNotBlank() ? updateData.lineId : userProfile.contact?.lineId
        contact.facebookUrl = updateData.facebookUrl?.isSafeNotBlank() ? updateData.facebookUrl : userProfile.contact?.facebookUrl
        return contact
    }

    /**
     * Create member entity with update data
     * @param updateData
     * @param userProfile
     * @param pictureUrl
     * @private
     */
    private createMemberEntity(
        updateData: UpdateProfileForm,
        userProfile: LearnerEntity | TutorEntity,
        pictureUrl?: string
    ): MemberEntity {
        const member = new MemberEntity()
        member.id = userProfile.member.id
        member.firstname = updateData.firstname
        member.lastname = updateData.lastname
        member.gender = updateData.gender
        member.dateOfBirth = updateData.dateOfBirth
        member.email = updateData.email
        member.username = updateData.username
        member.profileUrl = pictureUrl?.isSafeNotBlank() ? pictureUrl : userProfile.member?.profileUrl
        member.updated = new Date()
        return member
    }

    /**
     * Save member and contact data
     * @param member
     * @param contact
     * @private
     */
    private async saveUserData(member: MemberEntity, contact: ContactEntity) {
        const queryRunner = this.connection.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(contact)
            await queryRunner.manager.save(member)
            await queryRunner.commitTransaction()
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not save user profile", UserError.CAN_NOT_UPDATE)
        } finally {
            await queryRunner.release()
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
            throw ErrorExceptions.create("Can not get user address list", UserError.CAN_NOT_GET_ADDRESS)
        }
    }

    /**
     * Crate or update an user address data from data form and user id
     * @param userId
     * @param address
     */
    async updateUserAddress(userId: string, address: Address): Promise<void> {
        try {
            const member = new MemberEntity()
            member.id = userId
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
            throw ErrorExceptions.create("Can not update user address", CommonError.UNEXPECTED_ERROR)
        }
    }

    /**
     * Get user coin balance
     * @param user
     */
    async getUserCoinBalance(user: User): Promise<CoinEntity> {
        try {
            return await this.connection.getRepository(CoinEntity)
                .findOne({
                    where: {
                        member: user.id
                    }
                })
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not found coin balance", CoinError.CAN_NOT_FOUND_COIN_BALANCE)
        }
    }

    /**
     * Get user coin transaction
     * @param user
     */
    async getUserCoinTransaction(user: User): Promise<CoinTransactionEntity[]> {
        try {
            return await this.connection.getRepository(CoinTransactionEntity)
                .find({
                    where: {
                        member: user.id
                    },
                    order: {
                        transactionDate: "DESC"
                    }
                })
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not found coin transaction", CoinError.CAN_NOT_FOUND_COIN_TRANSACTION)
        }
    }

    /**
     * Get user (tutor) redeem transaction
     * @param user
     */
    async getUserCoinRedeemTransaction(user: User): Promise<ExchangeTransactionEntity[]> {
        try {
            return await this.connection.getRepository(ExchangeTransactionEntity)
                .find({
                    where: {
                        member: user.id
                    },
                    join: {
                        alias: "transaction",
                        leftJoinAndSelect: {
                            exchangeRate: "transaction.exchangeRate"
                        }
                    },
                    order: {
                        requestDate: "ASC"
                    }
                })
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not found coin redeem transaction", CoinError.CAN_NOT_FOUND_COIN_REDEEM_TRANSACTION)
        }
    }

    /**
     * Create and update identity verification request
     * @param requestId
     * @param user
     * @param cardImgPath
     * @param faceImgPath
     * @param cardFaceImgPath
     * @param isUpdate
     */
    async requestVerifyIdentity(
        requestId: string,
        user: User,
        cardImgPath: string,
        faceImgPath: string,
        cardFaceImgPath: string,
        isUpdate: boolean
    ): Promise<boolean> {
        const queryRunner = this.connection.createQueryRunner()
        try {
            const member = new MemberEntity()
            member.id = user.id

            const userVerify = new UserVerifyEntity()
            userVerify.id = requestId
            userVerify.member = member
            userVerify.documentUrl1 = cardImgPath
            userVerify.documentUrl2 = faceImgPath
            userVerify.documentUrl3 = cardFaceImgPath
            userVerify.type = UserVerify.IDENTITY

            if (!isUpdate) {
                userVerify.created = new Date()
            }

            await queryRunner.connect()
            await queryRunner.startTransaction()
            await queryRunner.manager.save(userVerify)
            await queryRunner.commitTransaction()

            return true
        } catch (error) {
            logger.error(error)
            await queryRunner.rollbackTransaction()
            throw ErrorExceptions.create("Can not request identity verify", UserError.CAN_NOT_REQUEST_VERIFY)
        } finally {
            await queryRunner.release()
        }
    }

    /**
     * Get user identity verification data
     * @param user
     */
    async getIdentityVerification(user: User): Promise<UserVerifyEntity> {
        try {
            return this.connection.createQueryBuilder(UserVerifyEntity, "verify")
                .leftJoinAndSelect("verify.member", "member")
                .where("member.id like :userId", { "userId": user.id })
                .andWhere("verify.type = :type", { "type": UserVerify.IDENTITY })
                .orderBy("verify.updated", "DESC")
                .getOne()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get verification detail", VerificationError.CAN_NOT_GET_VERIFICATION_DETAIL)
        }
    }
}

export default MeRepository