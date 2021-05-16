import AddressForm from "../../../model/location/AddressForm";
import Address from "../../../model/location/Address";

export const AddressFormToAddressMapper = (from: AddressForm): Address => {
    return new Address(
        from.address,
        from.hintAddress,
        from.road,
        from.subDistrict,
        from.district,
        from.province,
        from.postcode,
        Number(from.lat),
        Number(from.lng),
        Number(from.type)
    )
}