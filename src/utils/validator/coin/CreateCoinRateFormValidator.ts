import AbstractValidator from "../AbstractValidator";
import CoinRate from "../../../model/coin/CoinRate";
import ValidateResult from "../ValidateResult";
import {isEmpty} from "../../../core/extension/CommonExtension";
import {CoinRateType} from "../../../model/coin/data/CoinRateType";

export class CreateCoinRateFormValidator extends AbstractValidator<CoinRate> {

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

        if (isEmpty(this.form?.startDate)) {
            this.errors["startDate"] = "Start date is required"
        }

        if (isEmpty(this.form?.endDate)) {
            this.errors["endDate"] = "End date is required"
        }

        if (this.form?.type?.isSafeNotNull() && !this.isCoinRateType(this.form?.type)) {
            this.errors["type"] = "Coin rate type is invalid"
        } else {
            this.errors["type"] = "Coin rate type is required"
        }

        this.isValid = !isEmpty(this.errors)

        return {
            error: this.errors,
            valid: this.isValid
        }
    }

    private isCoinRateType(type: string): boolean {
        return type in CoinRateType
    }
}