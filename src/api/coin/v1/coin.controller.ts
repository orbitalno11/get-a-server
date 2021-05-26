import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Query,
    UploadedFile,
    UseFilters,
    UseInterceptors
} from "@nestjs/common"
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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import User from "../../../model/User"
import { UserRole } from "../../../core/constant/UserRole"
import RedeemForm from "../../../model/coin/RedeemForm"
import { FileInterceptor } from "@nestjs/platform-express"
import { UploadFileUtils } from "../../../utils/multer/UploadFileUtils"
import { isEmpty } from "../../../core/extension/CommonExtension"
import CommonError from "../../../core/exceptions/constants/common-error.enum"

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
    @ApiCreatedResponse({ description: "Successful" })
    createCoinRate(@Body() body: CoinRate): Promise<IResponse<string>> {
        return launch(async () => {
            const data = CoinRate.createFormBody(body)
            const validator = new CreateCoinRateFormValidator(data)
            const validate = validator.validate()

            if (!validate.valid) {
                logger.error("Coin rate data is invalid")
                throw FailureResponse.create(CoinError.INVALID, HttpStatus.BAD_REQUEST, validate.error)
            }

            await this.service.createCoinRate(data)

            return SuccessResponse.create("Successful")
        })
    }

    /**
     * Get coin rate depend on user role and view page
     * @param userRole
     * @param currentUser
     */
    @Get("rates")
    @ApiOkResponse({ description: "coin rate list", type: CoinRate, isArray: true })
    getCoinRateList(@Query("user") userRole: string, @CurrentUser() currentUser: User): Promise<IResponse<CoinRate[]>> {
        return launch(async () => {
            const role = userRole?.isSafeNotBlank() ? userRole.toNumber() : UserRole.LEARNER
            const result = await this.service.getCoinRateList(role, currentUser)
            return SuccessResponse.create(result)
        })
    }

    /**
     * Buy coin
     * @param currentUserId
     * @param coinRateId
     */
    @Post()
    @ApiCreatedResponse({ description: "transaction no." })
    buyCoin(@CurrentUser("id") currentUserId: string, @Body("rate") coinRateId: number): Promise<IResponse<string>> {
        return launch(async () => {
            const result = await this.service.buyCoin(currentUserId, coinRateId)
            return SuccessResponse.create(result)
        })
    }

    @Post("redeem")
    @UseInterceptors(FileInterceptor("accountPic", new UploadFileUtils().uploadImageA4Vertical()))
    redeemCoin(@Body() body: RedeemForm, @UploadedFile() file: Express.Multer.File, @CurrentUser() currentUser: User) {
        return launch(async () => {
            const data = RedeemForm.createFromBody(body)

            if (isEmpty(file)) {
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST, "Can not found account picture")
            }
            await this.service.redeemCoin(data, file, currentUser)

            return SuccessResponse.create("Successful")
        })
    }
}