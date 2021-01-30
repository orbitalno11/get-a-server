import { auth } from "firebase-admin"
import { authentication } from "../configs/firebase/FirebaseConfig"
import LearnerForm from "../models/form/register/LearnerForm"

class UserManager {
    public static async createUser(registerData: LearnerForm): Promise<auth.UserRecord> {
        try {
            return await authentication.createUser({
                email: registerData.email,
                password: registerData.password
            })
        } catch (error) {
            return error
        }
    }

    public static async deleteUser(userId: string): Promise<void> {
        try {
            return await authentication.deleteUser(userId)
        } catch (error) {
            return error
        }
    }
}

export default UserManager