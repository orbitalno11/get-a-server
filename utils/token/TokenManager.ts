import { Request } from "express"
import { auth } from "firebase-admin"
import fs from "fs"
import jwt from "jsonwebtoken"
import { authentication } from "../../configs/firebase/FirebaseConfig"
import ErrorExceptions from "../../core/exceptions/ErrorExceptions"
import ErrorType from "../../core/exceptions/model/ErrorType"
import TokenErrorType from "../../core/exceptions/model/TokenErrorType"
import User from "../../models/common/User"
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

    public static async verifyFirebaseToken(token: string): Promise<boolean> {
        try {
            const decodedToken = await this.decodeFirebaseToken(token)
            const userId = decodedToken.uid
            const tokenExp = decodedToken.exp
            const currentTime = Math.floor(Date.now() / 1000)
            return userId.isSafeNotNull() && (tokenExp >= currentTime)
        } catch (error) {
            logger.error(error)
            throw new ErrorExceptions("Unexpected error while verify token", TokenErrorType.CAN_NOT_VERIFY_TOKEN)
        }
    }

    public static async decodeFirebaseToken(token: string): Promise<auth.DecodedIdToken> {
        try {
            return await authentication.verifyIdToken(token, true)
        } catch (error) {
            logger.error(error)
            throw new ErrorExceptions("Unexpected error while decode firebase token", TokenErrorType.CAN_NOT_DECODE_TOKEN)
        }
    }

    public static generateToken(userTokenData: User): string {
        try {
            const privateKey = fs.readFileSync("jwtRS256.key", "utf-8")
            const token = jwt.sign(userTokenData, privateKey, {
                algorithm: "RS256",
                expiresIn: 3600
            })
            return token
        } catch (error) {
            logger.error(error)
            throw new ErrorExceptions("Error while generate token", ErrorType.UNEXPECTED_ERROR)
        }
    }

    public static verifyToken(token: string): User {
        try {
            const publicKey = fs.readFileSync("jwtRS256.key.pub", "utf-8")
            const decoded = jwt.verify(token, publicKey, {
                algorithms: ["RS256"]
            })
            return decoded as User
        } catch (error) {
            logger.error(error)
            throw new ErrorExceptions("Error while verify token data", TokenErrorType.CAN_NOT_VERIFY_TOKEN)
        }
    }
}

export default TokenManager