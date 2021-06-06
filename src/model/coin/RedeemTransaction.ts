import { CoinRedeemStatus } from "./data/CoinTransaction.enum"
import { ApiProperty } from "@nestjs/swagger"

/**
 * Model class for redeem transaction
 * @author orbitalno11 2021 A.D.
 */
class RedeemTransaction {
     @ApiProperty() id: number
     @ApiProperty() amount: number
     @ApiProperty() amountCoin: number
     @ApiProperty() requestDate: Date
     @ApiProperty() approveDate: Date
     @ApiProperty() transferDate: Date
     @ApiProperty() status: CoinRedeemStatus
}

export default RedeemTransaction