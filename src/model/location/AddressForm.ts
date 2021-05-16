class AddressForm {
    address: string
    hintAddress: string | null
    road: string | null
    subDistrict: string
    district: string
    province: string
    postcode: string
    lat: number
    lng: number
    type: number

    public static createFromBody(data: AddressForm): AddressForm {
        const form = new AddressForm()
        form.address = data.address
        form.hintAddress = data.hintAddress
        form.road = data.road
        form.subDistrict = data.subDistrict
        form.district = data.district
        form.province = data.province
        form.postcode = data.postcode
        form.lat = Number(data.lat)
        form.lng = Number(data.lng)
        form.type = Number(data.type)
        return form
    }
}

export default AddressForm