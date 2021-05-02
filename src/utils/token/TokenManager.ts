import { Request } from "express"
import { Injectable } from "@nestjs/common"
import { logger } from "../../core/logging/Logger"
import ErrorExceptions from "../../core/exceptions/ErrorExceptions"
import { authentication } from "../../configs/FirebaseConfig"
import { auth } from "firebase-admin"
import * as fs from "fs"
import * as jwt from "jsonwebtoken"
import TokenError from "../../core/exceptions/constants/token-error.enum"
import CommonError from "../../core/exceptions/constants/common-error.enum"
import User from "../../model/User"
import { isNotEmpty } from "../../core/extension/CommonExtension"

@Injectable()
class TokenManager {
    public extractAuthToken(req: Request) {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            return req.headers.authorization.split("Bearer ")[1]
        } else {
            logger.error("Cannot found token")
            return null
        }
    }

    public async verifyFirebaseToken(token: string): Promise<boolean> {
        try {
            const decodedToken = await this.decodeFirebaseToken(token)
            const userId = decodedToken.uid
            const tokenExp = decodedToken.exp
            const currentTime = Math.floor(Date.now() / 1000)
            return userId.isSafeNotNull() && tokenExp >= currentTime
        } catch (error) {
            logger.error(error)
            throw new ErrorExceptions(
                "Unexpected error while verify token",
                TokenError.CAN_NOT_VERIFY
            )
        }
    }

    public async decodeFirebaseToken(
        token: string
    ): Promise<auth.DecodedIdToken> {
        try {
            return await authentication.verifyIdToken(token, true)
        } catch (error) {
            logger.error(error)
            throw new ErrorExceptions(
                "Unexpected error while decode firebase token",
                TokenError.CAN_NOT_DECODE
            )
        }
    }

    public generateToken(userTokenData: User): string {
        try {
            const privateKey = fs.readFileSync("jwtRS256.key", "utf-8")
            const token = jwt.sign(JSON.parse(JSON.stringify(userTokenData)), privateKey, {
                algorithm: "RS256",
                expiresIn: 7200
            })
            return token
        } catch (error) {
            logger.error(error)
            throw new ErrorExceptions(
                "Error while generate token",
                CommonError.UNEXPECTED_ERROR
            )
        }
    }

    public verifyToken(token: string): boolean {
        try {
            const publicKey = fs.readFileSync("jwtRS256.key.pub", "utf-8")
            const decoded = jwt.verify(token, publicKey, {
                algorithms: ["RS256"]
            })
            return isNotEmpty(decoded)
        } catch (error) {
            logger.error(error)
            throw new ErrorExceptions(
                "Can not verify token",
                TokenError.CAN_NOT_VERIFY
            )
        }
    }

    public decodeToken(token: string): User {
        try {
            const publicKey = fs.readFileSync("jwtRS256.key.pub", "utf-8")
            const decoded = jwt.verify(token, publicKey, {
                algorithms: ["RS256"]
            })
            return decoded as User
        } catch (error) {
            logger.error(error)
            throw new ErrorExceptions(
                "Can nor decode token",
                TokenError.CAN_NOT_VERIFY
            )
        }
    }
}

export default TokenManager
