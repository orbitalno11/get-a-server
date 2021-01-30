import LearnerForm from "../../../models/form/register/LearnerForm"
import Learner from "../../../models/Learner"

const LearnerToArrayMapper = (from: Learner) => (
    [
        from.id,
        from.firstname,
        from.lastname,
        from.gender,
        from.dateOfBirth,
        from.address1,
        from.address2,
        from.email,
        from.username,
        from.created,
        from.updated
    ]
)

export default LearnerToArrayMapper