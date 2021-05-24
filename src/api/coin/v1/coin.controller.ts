import { Body, Controller, Get, HttpStatus, Post, Query, UseFilters, UseInterceptors } from "@nestjs/common"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import { CoinService } from "./coin.service"
import CoinRate from "../../../model/coin/CoinRate"
import { logger } from "../../../core/logging/Logger"
import FailureResponse from "../../../core/response/FailureResponse"
import { CreateCoinRateFormValidator } from "../../../utils/validator/coin/CreateCoinRateFormValidator"
import SuccessResponse from "../../../core/response/SuccessResponse"
import IResponse from "../../../core/response/IResponse"
import { launch } from "../../../core/common/launch"
import { CurrentUser } from "../../../decorator/CurrentUser.decorator"
import { CoinError } from "../../../core/exceptions/constants/coin.error"
import { ApiTags } from "@nestjs/swagger"

/**
 * Class for coin api controller
 * @author orbitalno11 2021 A.D.
 */
@ApiTags("coin")
@Controller("v1/coin")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class CoinController {
    constructor(private readonly service: CoinService) {
    }

    /**
     * Create exchange rate
     * @param body
     */
    @Post("rate")
    createCoinRate(@Body() body: CoinRate): Promise<IResponse<string>> {
        return launch(async () => {
            const data = CoinRate.createFormBody(body)
            const validator = new CreateCoinRateFormValidator(data)
            const validate = validator.validate()

            if (!validate.valid) {
                logger.error("Coin rate data is invalid")
                throw FailureResponse.create(CoinError.INVALID, HttpStatus.BAD_REQUEST, validate.error)
            }

            const result = await this.service.createCoinRate(data)

            return SuccessResponse.create(result)
        })
    }

    /**
     * Get coin rate depend on user role and view page
     * @param userRole
     */
    @Get("rates")
    getCoinRateList(@Query("user") userRole: number): Promise<IResponse<CoinRate[]>> {
        return launch(async () => {
            const result = await this.service.getCoinRateList(Number(userRole))
            return SuccessResponse.create(result)
        })
    }

    /**
     * Buy coin
     * @param currentUserId
     * @param coinRateId
     */
    @Post()
    buyCoin(@CurrentUser("id") currentUserId: string, @Body("rate") coinRateId: number): Promise<IResponse<string>> {
        return launch(async () => {
            const result = await this.service.buyCoin(currentUserId, coinRateId)
            return SuccessResponse.create(result)
        })
    }
}