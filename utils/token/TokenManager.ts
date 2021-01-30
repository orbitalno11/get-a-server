import { auth, clientAuth } from "../../configs/firebase/FirebaseConfig"
import FailureResponse from "../../core/response/FailureResponse"

class TokenManager {
    public static async getToken(userId: string) {
        try {
            const user = await auth.getUser(userId)
        } catch (error) {
            return new FailureResponse("Unexpected error", 500, error)
        }
    }
}