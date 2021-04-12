/**
 * Class for payment detail
 * @author oribitalno11 2021 A.D.
 */
class CoinPayment {
    transactionId: string
    paymentTransId: string
    userId: string
    amount: number
    coinRate: number
    status: number
    refNo1: string
    refNo2: string
    refNo3: string
    created: Date
    updated: Date
}

export default CoinPayment