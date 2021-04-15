import {EnrollStatus} from "./data/EnrollStatus";
import Address from "../location/Address";

/**
 * @author oribitalno11 2021 A.D.
 */
class OfflineCourseEnroll {
    firstname: string
    lastname: string
    fullNameText: string
    photoUrl: string
    address: Address
    status: EnrollStatus
}

export default OfflineCourseEnroll