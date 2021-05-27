/**
 * enum for coin transaction type
 * @author orbitalno11 2021 A.D.
 */
export enum CoinTransactionType {
    DEPOSIT = 0,
    WITHDRAW = 1,
    TRANSFER = 2,
    PAID = 3,
    REQUEST_REDEEM_SENT = 4,
    REQUEST_REDEEM_TRANSFERRED = 5,
    REQUEST_REDEEM_APPROVED = 6,
    REQUEST_REDEEM_CANCELED = 7,
    REQUEST_REDEEM_DENIED = 8
}