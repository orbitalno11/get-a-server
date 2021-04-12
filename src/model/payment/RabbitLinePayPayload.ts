/**
 * Class for Rabbit LINE Pay payload
 * @author orbitalno11 2021 A.D.
 */
class RabbitLinePayPayload {
    amount: number
    currency: string = "THB"
    orderId: string
    packages: {
        id: string,
        amount: number,
        name: string,
        products: {
            name: string,
            quantity: number,
            price: number
        }[]
    }[]
    redirectUrls: {
        confirmUrl: string,
        cancelUrl: string
    }
    // productName: string
    // amount: number
    // orderId: string
    // currency = "THB"
    // confirmUrl: string
    // confirmUrlType = "SERVER"

    toJson(): string {
        return JSON.stringify(this)
    }
}

export default RabbitLinePayPayload