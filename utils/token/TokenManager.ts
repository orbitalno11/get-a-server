import jwt from "jsonwebtoken"
import { authentication } from "../../configs/firebase/FirebaseConfig"
import FailureResponse from "../../core/response/FailureResponse"
import UserTokenData from "../../models/UserTokenData"

class TokenManager {
    public static async getToken(userId: string) {
        try {
            const user = await authentication.getUser(userId)
        } catch (error) {
            return new FailureResponse("Unexpected error", 500, error)
        }
    }

    public static generateSimpleProfileTokenData(userTokenData: UserTokenData): string | null {
        const secretKey = process.env.auth_secret_key
        if (secretKey == null && secretKey == undefined) return null
        const token = jwt.sign(userTokenData, secretKey , {
            algorithm: 'HS256',
            expiresIn: 3600
        })
        return `Bearer ${token}`
    }
}

export default TokenManager