import { HttpStatus, Injectable } from "@nestjs/common"
import { logger } from "../../../core/logging/Logger"
import FailureResponse from "../../../core/response/FailureResponse"
import TokenManager from "../../../utils/token/TokenManager"
import UserManager from "../../../utils/UserManager"
import TokenError from "../../../core/exceptions/constants/token-error.enum"
import UserError from "../../../core/exceptions/constants/user-error.enum"
import { launch } from "../../../core/common/launch"

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly tokenManager: TokenManager,
        private readonly userManager: UserManager
    ) {
    }

    getToken(token: string): Promise<string> {
        return launch(async () => {
            const validToken = await this.tokenManager.verifyFirebaseToken(token)
            if (!validToken) {
                throw FailureResponse.create(
                    TokenError.INVALID,
                    HttpStatus.UNAUTHORIZED
                )
            }
            const firebaseUser = await this.tokenManager.decodeFirebaseToken(token)
            const userData = await this.userManager.getUser(firebaseUser.uid)

            if (!userData) {
                logger.error("Can not find user from token")
                throw FailureResponse.create(
                    TokenError.CAN_NOT_FOUND,
                    HttpStatus.NOT_FOUND
                )
            }
            if (!userData.id) {
                logger.error("Can not find user id")
                throw FailureResponse.create(
                    UserError.CAN_NOT_FOUND_ID,
                    HttpStatus.NOT_FOUND
                )
            }

            return this.tokenManager.generateToken(userData)
        })
    }
}
