/**
 * Data class for coin rate form
 * @author orbitalno11 2021 A.D.
 */
class CoinRateForm {
    title: string
    baht: number
    coin: number
    type: string
    startDate: Date
    endDate: Date

    public static createFormBody(body: CoinRateForm): CoinRateForm {
        const out = new CoinRateForm()
        out.title = body.title
        out.baht = Number(body.baht)
        out.coin = Number(body.coin)
        out.type = body.type
        out.startDate = new Date(body.startDate)
        out.endDate = new Date(body.endDate)
        return out
    }
}

export default CoinRateForm