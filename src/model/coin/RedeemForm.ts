import { ApiProperty } from "@nestjs/swagger"

class RedeemForm {
    @ApiProperty() rateId: number
    @ApiProperty() bankId: string
    @ApiProperty() accountNo: string
    @ApiProperty() accountName: string
    @ApiProperty() numberOfCoin: number
    @ApiProperty() amount: number

    public static createFromBody(body: RedeemForm): RedeemForm {
        const form = new RedeemForm()
        form.rateId = Number(body.rateId)
        form.bankId = body.bankId
        form.accountNo = body.accountNo
        form.accountName = body.accountName
        form.numberOfCoin = Number(body.numberOfCoin)
        form.amount = Number(body.amount)
        return form
    }
}

export default RedeemForm