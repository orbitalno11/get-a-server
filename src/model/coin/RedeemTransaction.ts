import CoinRate from "./CoinRate"
import { CoinTransactionType } from "./data/CoinTransaction.enum"
import { ApiProperty } from "@nestjs/swagger"

/**
 * Model class for redeem transaction
 * @author orbitalno11 2021 A.D.
 */
class RedeemTransaction {
     @ApiProperty() coinRate: CoinRate
     @ApiProperty() requestDate: Date
     @ApiProperty() approveDate: Date
     @ApiProperty() transferDate: Date
     @ApiProperty() status: CoinTransactionType
}

export default RedeemTransaction