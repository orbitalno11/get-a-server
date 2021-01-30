import { Request } from "express"
import { auth } from "firebase-admin"
import jwt from "jsonwebtoken"
import { authentication } from "../../configs/firebase/FirebaseConfig"
import { isSafeNotNull } from "../../core/extension/StringExtension"
import FailureResponse from "../../core/response/FailureResponse"
import User from "../../models/User"
import { logger } from "../log/logger"

class TokenManager {
    public static extractAuthToken(req: Request) {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            return req.headers.authorization.split("Bearer ")[1]
        } else {
            logger.error("Cannot found token")
            return null
        }
    }

    public static async verifyToken(token: string): Promise<boolean> {
        try {
            const decodedToken = await this.decodeFirebaseToken(token)
            const userId = decodedToken.uid
            const tokenExp = decodedToken.exp
            return isSafeNotNull(userId) && (tokenExp >= Date.now())
        } catch (error) {
            logger.error(error)
            throw new FailureResponse("Unexpected error while verify token", 500, error)
        }
    }

    public static async decodeFirebaseToken(token: string): Promise<auth.DecodedIdToken> {
        try {
            return await authentication.verifyIdToken(token, true)
        } catch (error) {
            logger.error(error)
            throw new FailureResponse("Unexpected error while decode firebase token", 500, error)
        }
    }

    public static generateSimpleProfileTokenData(userTokenData: User): string | null {
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