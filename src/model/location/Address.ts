import SubDistrict from "./SubDistrict";
import District from "./District";
import Province from "./Province";
import GeoLocation from "./GeoLocation";
import {LocationType} from "./data/LocationType";

class Address {
    address: string
    hintAddress: string | null
    road: string | null
    subDistrict: SubDistrict
    district: District
    province: Province
    postcode: string
    geoLocation: GeoLocation
    type: LocationType
    fullAddressText: string

    constructor(
        address: string,
        hint: string,
        road: string,
        subDistrict: string,
        district: string,
        province: string,
        postCode: string,
        latitude: number,
        longitude: number,
        type: number
    ) {
        this.address = address
        this.hintAddress = hint
        this.road = road
        this.subDistrict = new SubDistrict()
        this.subDistrict.id = subDistrict
        this.district = new District()
        this.district.id = district
        this.province = new Province()
        this.province.id = province
        this.postcode = postCode
        this.geoLocation = new GeoLocation()
        this.geoLocation.latitude = latitude
        this.geoLocation.longitude = longitude
        this.type = type
    }
}

export default Address;
