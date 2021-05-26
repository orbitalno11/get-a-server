import AbstractValidator2 from "../AbstractValidator2"
import RedeemForm from "../../../model/coin/RedeemForm"
import ValidateResult from "../ValidateResult"
import { isEmpty } from "../../../core/extension/CommonExtension"
import { Bank } from "../../../model/common/data/Bank.enum"

class RedeemFormValidator extends AbstractValidator2<RedeemForm> {
    constructor(data: RedeemForm) {
        super(data);
    }

    validator(): ValidateResult<any> {
        if (!this.form.rateId?.isSafeNumber()) {
            this.errors["rateId"] = "rate id is required"
        }

        if (!this.form.bankId?.isSafeNotBlank()) {
            this.errors["bankId"] = "bank id is required"
        } else {
            if (!(this.form.bankId in Bank)) {
                this.errors["bankId"] = "bank id is invalid"
            }
        }

        if (!this.form.accountNo?.isSafeNotBlank()) {
            this.errors["accountNo"] = "account no. is required"
        }

        if (!this.form.accountName?.isSafeNotBlank()) {
            this.errors["accountName"] = "account name is required"
        }

        if (!this.form.numberOfCoin?.isSafeNumber() && !this.form.numberOfCoin?.isPositiveValue()) {
            this.errors["numberOfCoin"] = "number of coin is invalid"
        }

        if (!this.form.amount?.isSafeNumber() && !this.form.amount?.isPositiveValue()) {
            this.errors["amount"] = "amount is invalid"
        }

        this.isValid = isEmpty(this.errors)

        return {
            valid: this.isValid,
            error: this.errors
        }
    }
}

export default RedeemFormValidator