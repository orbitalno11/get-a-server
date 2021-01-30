import LearnerForm from "../../../models/form/register/LearnerForm"
import Learner from "../../../models/Learner"

const LearnerFormToLearnerMapper = (from: LearnerForm): Learner => (
    {
        id: null,
        firstname: from.firstname,
        lastname: from.lastname,
        dateOfBirth: from.dateOfBirth,
        gender: from.gender,
        email: from.email,
        username: from.email,
        address1: null,
        address2: null,
        created: new Date(),
        updated: new Date()
    }
)

export default LearnerFormToLearnerMapper