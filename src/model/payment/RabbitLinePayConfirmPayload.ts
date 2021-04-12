class RabbitLinePayConfirmPayload {
    amount: number
    currency: string = "THB"

    toJson(): string {
        return JSON.stringify(this)
    }
}

export default RabbitLinePayConfirmPayload