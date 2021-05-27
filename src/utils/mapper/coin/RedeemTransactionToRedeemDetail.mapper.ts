import Mapper from "../../../core/common/Mapper"
import { RedeemTransactionEntity } from "../../../entity/coins/RedeemTransaction.entity"
import RedeemDetail from "../../../model/coin/RedeemDetail"
import { BankEntity } from "../../../entity/common/Bank.entity"
import Bank from "../../../model/common/Bank"
import { ExchangeRateEntityToCoinRateMapper } from "./ExchangeRateEntityToCoinRate.mapper"
import { MemberEntityToPublicProfileMapper } from "../member/MemberEntityToPublicProfile.mapper"

export class RedeemTransactionToRedeemDetailMapper implements Mapper<RedeemTransactionEntity, RedeemDetail> {
    map(from: RedeemTransactionEntity): RedeemDetail {
        const detail = new RedeemDetail()
        detail.id = from.id
        detail.bank = this.mapBank(from.bank)
        detail.accountNo = from.accountNo
        detail.accountName = from.accountName
        detail.accountPic = from.accountPic
        detail.numberOfCoin = from.amountCoin
        detail.amount = from.amount
        detail.coinRate = ExchangeRateEntityToCoinRateMapper(from.exchangeRate)
        detail.owner = new MemberEntityToPublicProfileMapper().map(from.member)
        detail.requestDate = from.requestDate
        detail.approveDate = from.approveDate
        detail.transferDate = from.transferDate
        detail.status = from.requestStatus
        return detail
    }

    private mapBank(from: BankEntity): Bank {
        const bank = new Bank()
        bank.id = from.id
        bank.title = from.title
        return bank
    }
}