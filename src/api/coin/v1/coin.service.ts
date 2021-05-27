import { HttpStatus, Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { v4 as uuidV4 } from "uuid"
import CoinRate from "../../../model/coin/CoinRate"
import CoinRepository from "../../../repository/CoinRepository"
import { ExchangeRateEntityToCoinRateMapper } from "../../../utils/mapper/coin/ExchangeRateEntityToCoinRate.mapper"
import { UserRole } from "../../../core/constant/UserRole"
import { launch } from "../../../core/common/launch"
import CoinPayment from "../../../model/payment/CoinPayment"
import * as config from "../../../configs/EnvironmentConfig"
import User from "../../../model/User"
import ErrorExceptions from "../../../core/exceptions/ErrorExceptions"
import UserError from "../../../core/exceptions/constants/user-error.enum"
import RedeemForm from "../../../model/coin/RedeemForm"
import UserUtil from "../../../utils/UserUtil"
import { isEmpty, isNotEmpty } from "../../../core/extension/CommonExtension"
import { CoinError } from "../../../core/exceptions/constants/coin.error"
import { logger } from "../../../core/logging/Logger"
import { FileStorageUtils } from "../../../utils/files/FileStorageUtils"
import { ImageSize } from "../../../core/constant/ImageSize.enum"
import { CoinRateType } from "../../../model/coin/data/CoinRateType"
import FailureResponse from "../../../core/response/FailureResponse"
import RedeemDetail from "../../../model/coin/RedeemDetail"
import { RedeemTransactionToRedeemDetailMapper } from "../../../utils/mapper/coin/RedeemTransactionToRedeemDetail.mapper"
import { CoinTransactionType } from "../../../model/coin/data/CoinTransaction.enum"

/**
 * Class for coin api service
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class CoinService {
    constructor(
        private readonly connection: Connection,
        private readonly repository: CoinRepository,
        private readonly userUtil: UserUtil,
        private readonly fileStorageUtil: FileStorageUtils
    ) {
    }

    /**
     * Create an exchange coin rate data
     * @param form
     */
    async createCoinRate(form: CoinRate) {
        return launch(async () => {
            await this.repository.createCoinRate(form)
        })
    }

    /**
     * Get coin rate depend on user role
     * @param userRole
     * @param user
     */
    async getCoinRateList(userRole: UserRole, user?: User): Promise<CoinRate[]> {
        return launch(async () => {
            if (userRole === UserRole.ADMIN && user?.role !== UserRole.ADMIN) {
                throw ErrorExceptions.create("Do not have permission", UserError.DO_NOT_HAVE_PERMISSION)
            }

            const result = await this.repository.getCoinRateList(userRole)
            return result.map(data => ExchangeRateEntityToCoinRateMapper(data))
        })
    }

    /**
     * Buy coin from exchange rate id
     * @param userId
     * @param rateId
     */
    async buyCoin(userId: string, rateId: number): Promise<string> {
        return launch(async () => {
            const transactionId = "GET-A" + uuidV4()
            const rateDetail = await this.repository.getCoinRate(rateId)

            if (isNotEmpty(rateDetail)) {
                const orderDetail = new CoinPayment()
                orderDetail.transactionId = transactionId
                orderDetail.userId = userId
                orderDetail.amount = rateDetail.baht
                orderDetail.coinRate = rateDetail.id
                orderDetail.created = new Date()
                orderDetail.refNo1 = this.createRefNo(1)
                orderDetail.refNo2 = this.createRefNo(2)
                orderDetail.refNo3 = this.createRefNo(3)

                await this.repository.buyCoin(orderDetail, rateDetail)
                return transactionId
            } else {
                throw ErrorExceptions.create("Can not found coin rate", CoinError.CAN_NOT_FOUND_COIN_RATE)
            }
        })
    }

    /**
     * Create reference number
     * @param refNo
     * @private
     */
    private createRefNo(refNo: number): string {
        let result = []
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        const charactersLength = characters.length

        if (refNo != 3) {
            for (let index = 0; index < 3; index++) {
                result.push(characters.charAt(Math.floor(Math.random() * charactersLength)))
            }
            const resultString = result.join("")
            return `GETA${Date.now()}${resultString}`
        } else {
            for (let index = 0; index < 3; index++) {
                result.push(characters.charAt(Math.floor(Math.random() * charactersLength)))
            }
            const resultString = result.join("")
            return `${config.SCB_REF3_PREFIX}${Date.now()}${resultString}`
        }
    }

    /**
     * Create redeem request
     * @param data
     * @param file
     * @param user
     */
    async redeemCoin(data: RedeemForm, file: Express.Multer.File, user: User) {
        let fileUrl = ""
        try {
            if (!await this.userUtil.isVerified(user.id)) {
                throw ErrorExceptions.create("Your account is not verified", UserError.NOT_VERIFIED)
            }

            const rate = await this.repository.getCoinRate(data.rateId)
            if (isEmpty(rate) || rate?.type !== CoinRateType.TRANSFER) {
                throw ErrorExceptions.create("Can not found coin rate", CoinError.CAN_NOT_FOUND_COIN_RATE)
            }

            const bank = await this.repository.getBankDetailById(data.bankId)
            if (isEmpty(bank)) {
                throw ErrorExceptions.create("Can not found bank", CoinError.CAN_NOT_FOUND_BANK)
            }

            fileUrl = await this.fileStorageUtil.uploadImageTo(file, user.id, "redeem", ImageSize.A4_WIDTH_VERTICAL_PX, ImageSize.A4_HEIGHT_VERTICAL_PX)

            const userBalance = await this.userUtil.getCoinBalance(user.id)

            if (data.numberOfCoin > userBalance.amount) {
                throw ErrorExceptions.create("Your coin is not enough", CoinError.NOT_ENOUGH)
            }

            const totalAmount = this.calculateAmountBahtTransfer(data.numberOfCoin, rate.baht, rate.coin)

            if (totalAmount !== data.amount) {
                throw ErrorExceptions.create("Total amount is invalid", CoinError.INVALID_AMOUNT)
            }

            await this.repository.redeemCoin(data, userBalance, rate, bank, fileUrl, user)
        } catch (error) {
            logger.error(error)
            if (fileUrl.isSafeNotBlank()) {
                await this.fileStorageUtil.deleteFile(fileUrl)
            }
            throw ErrorExceptions.create("Can not request redeem", CoinError.CAN_NOT_CREATE_REDEEM)
        }
    }

    /**
     * Calculate amount baht for transfer
     * @param numberOfCoin
     * @param exchangeBaht
     * @param exchangeCoin
     * @private
     */
    private calculateAmountBahtTransfer(numberOfCoin: number, exchangeBaht: number, exchangeCoin: number): number {
        return (numberOfCoin * exchangeBaht) / exchangeCoin
    }

    /**
     * Get redeem detail by id
     * @param redeemId
     * @param user
     */
    getRedeemCoinById(redeemId: number, user: User): Promise<RedeemDetail> {
        return launch(async () => {
            const detail = await this.repository.getRedeemCoinById(redeemId)

            if (isEmpty(detail)) {
                throw ErrorExceptions.create("Can not found detail", CoinError.CAN_NOT_FOUND_COIN_REDEEM_TRANSACTION)
            }

            if (detail.member?.id !== user.id && user.role !== UserRole.ADMIN) {
                throw FailureResponse.create(UserError.DO_NOT_HAVE_PERMISSION, HttpStatus.FORBIDDEN)
            }

            return new RedeemTransactionToRedeemDetailMapper().map(detail)
        })
    }

    /**
     * Get redeem detail list
     * @param status
     */
    getRedeemCoinList(status: number =  CoinTransactionType.REQUEST_REDEEM_SENT): Promise<Array<RedeemDetail>> {
        return launch(async () => {
            const redeemList = await this.repository.getRedeemCoinList(status)
            return isNotEmpty(redeemList) ? new RedeemTransactionToRedeemDetailMapper().mapList(redeemList) : Array()
        })
    }

    /**
     * Cancel redeem request
     * @param redeemId
     * @param user
     */
    cancelRedeemRequestById(redeemId: number, user: User) {
        return launch(async () => {
            const detail = await this.repository.getRedeemCoinById(redeemId)

            if (isEmpty(detail)) {
                throw ErrorExceptions.create("Can not found redeem", CoinError.CAN_NOT_FOUND_COIN_REDEEM_TRANSACTION)
            }

            if (user.id !== detail.member?.id) {
                throw FailureResponse.create(UserError.DO_NOT_HAVE_PERMISSION, HttpStatus.FORBIDDEN)
            }

            if (detail.requestStatus !== CoinTransactionType.REQUEST_REDEEM_SENT) {
                throw ErrorExceptions.create("Can not cancel", CoinError.CAN_NOT_CANCEL_REDEEM_REQUEST)
            }

            const userBalance = await this.userUtil.getCoinBalance(user.id)

            await this.repository.cancelRedeemCoinById(detail, userBalance)
        })
    }

    /**
     * Denied redeem request
     * @param redeemId
     * @param userId
     */
    deniedRedeemRequestById(redeemId: number, userId: string) {
        return launch(async () => {
            const detail = await this.repository.getRedeemCoinById(redeemId)

            if (isEmpty(detail)) {
                throw ErrorExceptions.create("Can not found redeem", CoinError.CAN_NOT_FOUND_COIN_REDEEM_TRANSACTION)
            }

            if (userId !== detail.member?.id) {
                throw FailureResponse.create(CoinError.INVALID, HttpStatus.BAD_REQUEST)
            }

            if (detail.requestStatus !== CoinTransactionType.REQUEST_REDEEM_SENT) {
                throw ErrorExceptions.create("Can not denied request", CoinError.CAN_NOT_DENIED_REDEEM_REQUEST)
            }

            const userBalance = await this.userUtil.getCoinBalance(userId)

            await this.repository.deniedRedeemCoinById(detail, userBalance)
        })
    }

    /**
     * Approved redeem request
     * @param redeemId
     */
    approvedRedeemRequest(redeemId: number) {
        return launch(async () => {
            const detail = await this.repository.getRedeemCoinById(redeemId)

            if (isEmpty(detail)) {
                throw ErrorExceptions.create("Can not found redeem", CoinError.CAN_NOT_FOUND_COIN_REDEEM_TRANSACTION)
            }

            if (detail.requestStatus !== CoinTransactionType.REQUEST_REDEEM_SENT) {
                throw ErrorExceptions.create("Can not approved", CoinError.CAN_NOT_APPROVED_REDEEM_REQUEST)
            }

            await this.repository.approvedRedeemCoinById(detail)
        })
    }
}