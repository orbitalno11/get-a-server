import SubDistrict from "./SubDistrict";
import District from "./District";
import Province from "./Province";
import GeoLocation from "./GeoLocation";
import {LocationType} from "./data/LocationType";
import { MemberAddressEntity } from "../../entity/member/memberAddress.entity"
import { isNotEmpty } from "../../core/extension/CommonExtension"
import { MemberAddressToAddressMapper } from "../../utils/mapper/location/MemberAddressToAddress.mapper"
import { ApiProperty } from "@nestjs/swagger"

class Address {
    @ApiProperty() address: string
    @ApiProperty() hintAddress: string | null
    @ApiProperty() road: string | null
    @ApiProperty() subDistrict: SubDistrict
    @ApiProperty() district: District
    @ApiProperty() province: Province
    @ApiProperty() postcode: string
    @ApiProperty() geoLocation: GeoLocation
    @ApiProperty({ enum: [LocationType] }) type: LocationType
    @ApiProperty() fullAddressText: string

    public static create(
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
    ): Address {
        const object = new Address()
        object.address = address
        object.hintAddress = hint
        object.road = road
        object.subDistrict = new SubDistrict()
        object.subDistrict.id = subDistrict
        object.district = new District()
        object.district.id = district
        object.province = new Province()
        object.province.id = province
        object.postcode = postCode
        object.geoLocation = new GeoLocation()
        object.geoLocation.latitude = latitude
        object.geoLocation.longitude = longitude
        object.type = type
        return object
    }

    getConvenienceAddress(addressList: MemberAddressEntity[]): Address | null {
        const convenience = addressList.filter((item) => {
            return item.type === LocationType.CONVENIENCE
        })
        return isNotEmpty(convenience) ? MemberAddressToAddressMapper(convenience[0]) : null
    }

    createFullAddressText(): string {
        const strArray = [this.address, this.road, this.subDistrict?.title, this.district?.title, this.province?.title, this.postcode].filter(Boolean)
        return strArray.join(", ")
    }
}

export default Address;
