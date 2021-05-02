import {
    Controller,
    Get,
    HttpStatus,
    Query,
    UseFilters,
    UseInterceptors
} from "@nestjs/common"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import FailureResponse from "../../../core/response/FailureResponse"
import SuccessResponse from "../../../core/response/SuccessResponse"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import { AuthenticationService } from "./authentication.service"
import TokenError from "../../../core/exceptions/constants/token-error.enum"
import { launch } from "../../../core/common/launch"

/**
 * Class for authentication route
 * @author orbitalno11 2021 A.D.
 */
@Controller("v1/auth")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class AuthenticationController {
    constructor(private readonly authService: AuthenticationService) {
    }

    /**
     * Get generate get-a token from firebase token
     * @param token
     */
    @Get("token")
    getToken(
        @Query("token") token: string
    ): Promise<SuccessResponse<string>> {
        return launch(async () => {
            if (!token?.isSafeNotNull()) {
                throw FailureResponse.create(
                    TokenError.CAN_NOT_FOUND,
                    HttpStatus.NOT_FOUND
                )
            }
            const generateToken = await this.authService.getToken(token)
            return SuccessResponse.create(generateToken)
        })
    }
}
