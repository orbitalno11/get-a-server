import AbstractValidator from "../AbstractValidator";
import CoinRate from "../../../model/coin/CoinRate";
import ValidateResult from "../ValidateResult";
import { isEmpty, isValidDate } from "../../../core/extension/CommonExtension"
import {CoinRateType} from "../../../model/coin/data/CoinRateType";

export class CreateCoinRateFormValidator extends AbstractValidator<CoinRate> {
    private readonly coinType: Array<string> = Object.values(CoinRateType)

    constructor(form: CoinRate) {
        super();
        this.setData(form)
    }

    validator(): ValidateResult<any> {
        if (!this.form?.title?.isSafeNotNull()) {
            this.errors["title"] = "Title is required"
        }

        if (!this.form?.baht?.isSafeNumber()) {
            this.errors["baht"] = "Baht value is required"
        }

        if (!this.form?.coin?.isSafeNumber()) {
            this.errors["coin"] = "Coin values is required"
        }

        if (isValidDate(this.form?.startDate)) {
            this.errors["startDate"] = "Start date is required"
        }

        if (isValidDate(this.form?.endDate)) {
            this.errors["endDate"] = "End date is required"
        }

        if (this.form?.type?.isSafeNotNull()) {
            if (!this.isCoinRateType(this.form?.type)) {
                this.errors["type"] = "Coin rate type is invalid"
            }
        } else {
            this.errors["type"] = "Coin rate type is required"
        }

        this.isValid = isEmpty(this.errors)

        return {
            error: this.errors,
            valid: this.isValid
        }
    }

    private isCoinRateType(type: string): boolean {
        return this.coinType.includes(type)
    }
}