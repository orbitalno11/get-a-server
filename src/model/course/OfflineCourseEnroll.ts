import Address from "../Address";
import {EnrollStatus} from "./data/EnrollStatus";

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