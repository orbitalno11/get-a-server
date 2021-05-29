import { ApiProperty } from "@nestjs/swagger"
import CoinRate from "./CoinRate"
import Bank from "../common/Bank"
import PublicProfile from "../profile/PublicProfile"
import { CoinTransactionType } from "./data/CoinTransaction.enum"

class RedeemDetail {
    @ApiProperty() id: number
    @ApiProperty() bank: Bank
    @ApiProperty() accountNo: string
    @ApiProperty() accountName: string
    @ApiProperty() accountPic: string
    @ApiProperty() numberOfCoin: number
    @ApiProperty() amount: number
    @ApiProperty() coinRate: CoinRate
    @ApiProperty() owner: PublicProfile
    @ApiProperty() requestDate: Date
    @ApiProperty() approveDate: Date
    @ApiProperty() transferDate: Date
    @ApiProperty() status: CoinTransactionType
}

export default RedeemDetail