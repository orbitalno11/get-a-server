/**
 * enum for coin transaction type
 * @author orbitalno11 2021 A.D.
 */
export enum CoinTransactionType {
    DEPOSIT = 0,
    WITHDRAW = 1,
    TRANSFER = 2,
    PAID = 3,
    INCOME =4
}

export enum CoinRedeemStatus {
    REQUEST_REDEEM_SENT = 0,
    REQUEST_REDEEM_APPROVED = 1,
    REQUEST_REDEEM_TRANSFER = 2,
    REQUEST_REDEEM_DENIED = 3,
    REQUEST_REDEEM_CANCELED = 4
}