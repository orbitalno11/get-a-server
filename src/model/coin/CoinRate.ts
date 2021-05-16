/**
 * Data class for coin rate form
 * @author orbitalno11 2021 A.D.
 */
class CoinRate {
    title: string
    baht: number
    coin: number
    type: string
    startDate: Date
    endDate: Date
    updateDate: Date

    public static createFormBody(body: CoinRate): CoinRate {
        const out = new CoinRate()
        out.title = body.title
        out.baht = Number(body.baht)
        out.coin = Number(body.coin)
        out.type = body.type
        out.startDate = new Date(body.startDate)
        out.endDate = new Date(body.endDate)
        out.updateDate = new Date()
        return out
    }
}

export default CoinRate