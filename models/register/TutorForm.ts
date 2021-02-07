import Register from "./Register"

interface TutorForm extends Register {
    subject1: number,
    subject2: number | null,
    subject3: number | null
}

export default TutorForm