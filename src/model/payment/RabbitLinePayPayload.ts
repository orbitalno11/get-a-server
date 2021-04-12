/**
 * Class for Rabbit LINE Pay payload
 * @author orbitalno11 2021 A.D.
 */
class RabbitLinePayPayload {
    productName: string
    amount: number
    orderId: string
    currency: string = "THB"
    confirmUrl: string
    confirmUrlType: string = "SERVER"

    toJson(): string {
        return JSON.stringify(this)
    }
}

export default RabbitLinePayPayload