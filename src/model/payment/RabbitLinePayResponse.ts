/**
 * Class for Rabbit LINE Pay response
 * @author orbitalno11 2021 A.D.
 */
class RabbitLinePayResponse {
    returnCode: string
    returnMessage: string
    info: {
        paymentUrl: {
            web: string,
            app: string
        },
        transactionId: number
        paymentAccessToken: string,
        orderId: string,
        payInfo: {
            method: string,
            amount: number
        }[]
    }
}

export default RabbitLinePayResponse