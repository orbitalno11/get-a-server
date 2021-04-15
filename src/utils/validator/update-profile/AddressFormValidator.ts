import AbstractValidator from "../AbstractValidator";
import AddressForm from "../../../model/location/AddressForm";
import ValidateResult from "../ValidateResult";
import {LocationType} from "../../../model/location/data/LocationType";
import {isEmpty} from "../../../core/extension/CommonExtension";

export class AddressFormValidator extends AbstractValidator<AddressForm> {
    constructor(data: AddressForm) {
        super();
        this.setData(data)
    }

    validator(): ValidateResult<any> {
        if (!this.form?.address?.isSafeNotBlank()) {
            this.errors["address"] = "address is required"
        }

        if (!this.form?.subDistrict?.isSafeNotBlank()) {
            this.errors["subDistrict"] = "subDistrict is required"
        }

        if (!this.form?.district?.isSafeNotBlank()) {
            this.errors["district"] = "district is required"
        }

        if (!this.form?.province?.isSafeNotBlank()) {
            this.errors["province"] = "province is required"
        }

        if (!this.form?.postcode?.isSafeNotBlank()) {
            this.errors["postcode"] = "postcode is required"
        }

        if (!this.form?.lat?.isSafeNumber()) {
            this.errors["latitude"] = "latitude is required"
        }

        if (!this.form?.lng?.isSafeNumber()) {
            this.errors["longitude"] = "longitude is required"
        }

        if (!this.form?.type?.isSafeNumber()) {
            this.errors["type"] = "type is required"
        } else {
            if (!this.isInTypeList(this.form.type)) {
                this.errors["type"] = "type is invalid"
            }
        }

        this.isValid = isEmpty(this.errors)

        return {
            error: this.errors,
            valid: this.isValid
        }
    }

    private isInTypeList(type: number): boolean {
        return type in LocationType
    }

}