import { PaymentStatus } from "./data/PaymentStatus"
import CoinRate from "../coin/CoinRate"

/**
 * Coin payment transaction
 * @author orbitalno11 2021 A.D.
 */
class CoinPaymentTransaction {
    transactionId: string
    paymentId: string
    transactionDate: Date
    paymentStatus: PaymentStatus
    paymentDetail: CoinRate
}

export default CoinPaymentTransaction