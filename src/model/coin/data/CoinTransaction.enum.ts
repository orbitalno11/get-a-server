/**
 * enum for coin transaction type
 * @author orbitalno11 2021 A.D.
 */
export enum CoinTransactionType {
    DEPOSIT = 0,
    WITHDRAW = 1,
    TRANSFER = 2,
    PAID = 3,
    REQUEST_REDEEM = 4,
    WAITING_FOR_APPROVE = 5,
    REQUEST_REDEEM_APPROVED = 6,
    CANCEL_REDEEM = 7
}