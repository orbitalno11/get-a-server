import {MemberAddressEntity} from "../../../entity/member/memberAddress.entity";
import Address from "../../../model/location/Address";

export const MemberAddressToAddressMapper = (from: MemberAddressEntity): Address => {
    const address = new Address(
        from.address,
        from.hintAddress,
        from.road,
        from.subDistrict?.id,
        from.district?.id,
        from.province?.id,
        from.postCode,
        from.latitude,
        from.longitude,
        from.type
    )
    address.subDistrict.title = from.subDistrict?.title
    address.district.title = from.district?.title
    address.province.title = from.province?.title
    address.fullAddressText = getFullAddressText(address)
    return address
}

const getFullAddressText = (data: Address): string => {
    const strArray = [data.address, data.road, data.subDistrict?.title, data.district?.title, data.province?.title, data.postcode].filter(Boolean)
    return strArray.join(", ")
}