export enum CoinError {
    CAN_NOT_CREATE_EXCHANGE_RATE = "can-not-create-exchange-rate",
    CAN_NOT_CREATE_REDEEM = "can-not-create-redeem",
    CAN_NOT_GET_RATE = "can-not-get-coin-rate",
    CAN_NOT_GET_REDEEM = "can-not-get-coin-redeem",
    CAN_NOT_FOUND_COIN_RATE = "can-not-found-coin-rate",
    CAN_NOT_FOUND_COIN_BALANCE = "can-not-found-coin-balance",
    CAN_NOT_FOUND_COIN_TRANSACTION = "can-not-found-transaction",
    CAN_NOT_FOUND_COIN_REDEEM_TRANSACTION = "can-not-found-transaction",
    INVALID = "coin-rate-is-invalid",
    NOT_ENOUGH = "not-enough-coin",
    ALREADY_BUY = "already-buy",
    INVALID_AMOUNT = "invalid-amount",
    CAN_NOT_FOUND_BANK = "can-not-found-bank",
    CAN_NOT_GET_BANK = "can-not-get-bank",
    CAN_NOT_CANCEL_REDEEM_REQUEST = "can-not-cancel-redeem-request",
    CAN_NOT_DENIED_REDEEM_REQUEST = "can-not-denied-redeem-request"
}