import Address from "../Address"

class AddressModel implements Address {
    address: string
    hintAddress: string | null
    road: string | null
    subDistrict: string
    district: string
    province: string
    postcode: string

    constructor(data: Address) {
        this.address = data.address
        this.hintAddress = data.hintAddress
        this.road = data.road
        this.subDistrict = data.subDistrict
        this.district = data.district
        this.province = data.province
        this.postcode = data.postcode
    }
}

export default AddressModel