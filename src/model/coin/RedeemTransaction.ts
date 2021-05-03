import CoinRate from "./CoinRate"
import { CoinTransactionType } from "./data/CoinTransaction.enum"

/**
 * Model class for redeem transaction
 * @author orbitalno11 2021 A.D.
 */
class RedeemTransaction {
    coinRate: CoinRate
    requestDate: Date
    approveDate: Date
    transferDate: Date
    status: CoinTransactionType
}

export default RedeemTransaction