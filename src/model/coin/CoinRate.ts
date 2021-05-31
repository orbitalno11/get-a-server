/**
 * Data class for coin rate form
 * @author orbitalno11 2021 A.D.
 */
import { ApiProperty } from "@nestjs/swagger"

class CoinRate {
    @ApiProperty() id: number
    @ApiProperty() title: string
    @ApiProperty() baht: number
    @ApiProperty() coin: number
    @ApiProperty() type: string
    @ApiProperty() startDate: Date
    @ApiProperty() endDate: Date
    @ApiProperty() updateDate: Date
    @ApiProperty() active: boolean

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