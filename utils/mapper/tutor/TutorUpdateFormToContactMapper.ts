import Contact from "../../../models/Contact"
import TutorUpdateForm from "../../../models/tutor/TutorUpdateForm"

const TutorUpdateFormToContactMapper = (from: TutorUpdateForm): Contact => (
    {
        phoneNumber: from.phoneNumber,
        lineId: from.lineId,
        facebookUrl: from.facebookUrl
    }
)

export default TutorUpdateFormToContactMapper