import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
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
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiTags
} from "@nestjs/swagger"
import User from "../../../model/User"
import { UserRole } from "../../../core/constant/UserRole"
import RedeemForm from "../../../model/coin/RedeemForm"
import { FileInterceptor } from "@nestjs/platform-express"
import { UploadFileUtils } from "../../../utils/multer/UploadFileUtils"
import { isEmpty } from "../../../core/extension/CommonExtension"
import CommonError from "../../../core/exceptions/constants/common-error.enum"
import RedeemFormValidator from "../../../utils/validator/coin/RedeemFormValidator"
import { ApiImplicitFile } from "@nestjs/swagger/dist/decorators/api-implicit-file.decorator"
import UserError from "../../../core/exceptions/constants/user-error.enum"
import RedeemDetail from "../../../model/coin/RedeemDetail"

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
     * Buy coin
     * @param currentUserId
     * @param coinRateId
     */
    @Post()
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                rate: {
                    type: "number"
                }
            }
        }
    })
    @ApiCreatedResponse({ description: "transaction no." })
    buyCoin(@CurrentUser("id") currentUserId: string, @Body("rate") coinRateId: number): Promise<IResponse<string>> {
        return launch(async () => {
            const result = await this.service.buyCoin(currentUserId, coinRateId)
            return SuccessResponse.create(result)
        })
    }

    /**
     * Create exchange rate
     * @param body
     */
    @Post("rate")
    @ApiBearerAuth()
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
     * Get coin rate by rate id
     * @param rateId
     */
    @Get("rate/:id")
    @ApiOkResponse({ description: "coin rate", type: CoinRate })
    @ApiBadRequestResponse({ description: "Invalid request data" })
    @ApiInternalServerErrorResponse({ description: "Can not get coin rate" })
    getCoinRate(@Param("id") rateId: string): Promise<IResponse<CoinRate>> {
        return launch(async () => {
            if (!rateId?.isSafeNotBlank() || (rateId?.isSafeNotBlank() && !rateId?.isNumber())) {
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }

            const rate = await this.service.getCoinRateById(rateId.toNumber())

            return SuccessResponse.create(rate)
        })
    }

    /**
     * Get coin rate depend on user role and view page
     * @param userRole
     * @param currentUser
     */
    @Get("rates")
    @ApiBearerAuth()
    @ApiOkResponse({ description: "coin rate list", type: CoinRate, isArray: true })
    getCoinRateList(@Query("user") userRole: UserRole = UserRole.VISITOR, @CurrentUser() currentUser: User): Promise<IResponse<CoinRate[]>> {
        return launch(async () => {
            const role = Number(userRole).isSafeNumber() ? Number(userRole) : UserRole.VISITOR
            const result = await this.service.getCoinRateList(role, currentUser)
            return SuccessResponse.create(result)
        })
    }

    /**
     * Create redeem request
     * @param body
     * @param accountPic
     * @param currentUser
     */
    @Post("redeem")
    @ApiBearerAuth()
    @ApiConsumes("multipart/form-data")
    @ApiImplicitFile({ name: "accountPic", required: true })
    @UseInterceptors(FileInterceptor("accountPic", new UploadFileUtils().uploadImageA4Vertical()))
    redeemCoin(@Body() body: RedeemForm, @UploadedFile() accountPic: Express.Multer.File, @CurrentUser() currentUser: User): Promise<IResponse<string>> {
        return launch(async () => {
            const data = RedeemForm.createFromBody(body)
            const validator = new RedeemFormValidator(data)
            const { valid, error } = validator.validate()

            if (!valid) {
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST, error)
            }

            if (isEmpty(accountPic)) {
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST, "Can not found account picture")
            }
            await this.service.redeemCoin(data, accountPic, currentUser)

            return SuccessResponse.create("Successful")
        })
    }

    /**
     * Get redeem list
     * @param status
     */
    @Get("redeem")
    @ApiBearerAuth()
    @ApiOkResponse({ description: "redeem detail", type: RedeemDetail, isArray: true })
    @ApiBadRequestResponse({ description: "invalid request data" })
    @ApiInternalServerErrorResponse({ description: "Can not get redeem detail" })
    getRedeemList(@Query("status") status: string): Promise<IResponse<Array<RedeemDetail>>> {
        return launch(async () => {
            if (status?.isSafeNotBlank() && !status?.isNumber()) {
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }

            const redeemList = await this.service.getRedeemCoinList(status?.toNumber())

            return SuccessResponse.create(redeemList)
        })
    }

    /**
     * Get redeem detail by id
     * @param redeemId
     * @param currentUser
     */
    @Get("redeem/:id")
    @ApiBearerAuth()
    @ApiOkResponse({ description: "redeem detail", type: RedeemDetail })
    @ApiBadRequestResponse({ description: "invalid request data" })
    @ApiForbiddenResponse({ description: "do not have permission" })
    @ApiInternalServerErrorResponse({ description: "Can not found detail" })
    @ApiInternalServerErrorResponse({ description: "Can not get redeem detail" })
    getRedeemCoin(@Param("id") redeemId: string, @CurrentUser() currentUser: User): Promise<IResponse<RedeemDetail>> {
        return launch(async () => {
            if (!redeemId?.isSafeNotBlank() || !redeemId?.isNumber()) {
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }

            if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.TUTOR) {
                throw FailureResponse.create(UserError.DO_NOT_HAVE_PERMISSION, HttpStatus.FORBIDDEN)
            }

            const detail = await this.service.getRedeemCoinById(redeemId.toNumber(), currentUser)

            return SuccessResponse.create(detail)
        })
    }

    /**
     * Approved redeem request
     * @param redeemId
     */
    @Get("redeem/:id/approved")
    @ApiBearerAuth()
    @ApiOkResponse({ description: "Successful" })
    @ApiBadRequestResponse({ description: "Invalid request data" })
    @ApiInternalServerErrorResponse({ description: "Can not found redeem" })
    @ApiInternalServerErrorResponse({ description: "Can not approved" })
    @ApiInternalServerErrorResponse({ description: "Can not approved redeem request" })
    approvedRedeemRequest(@Param("id") redeemId: string): Promise<IResponse<string>> {
        return launch(async () => {
            if (!redeemId?.isSafeNotBlank() || !redeemId?.isNumber()) {
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }

            await this.service.approvedRedeemRequest(redeemId.toNumber())

            return SuccessResponse.create("Successful")
        })
    }

    /**
     * Cancel redeem request
     * @param redeemId
     * @param currentUser
     */
    @Get("redeem/:id/cancel")
    @ApiBearerAuth()
    @ApiOkResponse({ description: "Successful" })
    @ApiBadRequestResponse({ description: "Invalid request data" })
    @ApiForbiddenResponse({ description: "Do not have a permission" })
    @ApiInternalServerErrorResponse({ description: "Can not found redeem" })
    @ApiInternalServerErrorResponse({ description: "Can not cancel" })
    @ApiInternalServerErrorResponse({ description: "Can not cancel redeem request" })
    cancelRedeemRequest(@Param("id") redeemId: string, @CurrentUser() currentUser: User): Promise<IResponse<string>> {
        return launch(async () => {
            if (!redeemId?.isSafeNotBlank() || !redeemId?.isNumber()) {
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }

            await this.service.cancelRedeemRequestById(redeemId.toNumber(), currentUser)

            return SuccessResponse.create("Successful")
        })
    }

    /**
     * Denied redeem request
     * @param redeemId
     * @param userId
     */
    @Get("redeem/:id/denied")
    @ApiBearerAuth()
    @ApiOkResponse({ description: "Successful" })
    @ApiBadRequestResponse({ description: "Invalid request data" })
    @ApiForbiddenResponse({ description: "Coin rate is invalid" })
    @ApiInternalServerErrorResponse({ description: "Can not found redeem" })
    @ApiInternalServerErrorResponse({ description: "Can not denied request" })
    @ApiInternalServerErrorResponse({ description: "Can not denied redeem request" })
    deniedRedeemRequest(@Param("id") redeemId: string, @Query("user") userId: string): Promise<IResponse<string>> {
        return launch(async () => {
            if (!redeemId?.isSafeNotBlank() || !redeemId?.isNumber() || !userId?.isSafeNotBlank()) {
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }

            await this.service.deniedRedeemRequestById(redeemId.toNumber(), userId)

            return SuccessResponse.create("Successful")
        })
    }
}