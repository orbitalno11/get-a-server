import { MeService } from "./me.service"
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
import AddressForm from "../../../model/location/AddressForm"
import { CurrentUser } from "../../../decorator/CurrentUser.decorator"
import { logger } from "../../../core/logging/Logger"
import FailureResponse from "../../../core/response/FailureResponse"
import { AddressFormValidator } from "../../../utils/validator/update-profile/AddressFormValidator"
import { AddressFormToAddressMapper } from "../../../utils/mapper/location/AddressFormToAddressMapper"
import SuccessResponse from "../../../core/response/SuccessResponse"
import Address from "../../../model/location/Address"
import IResponse from "../../../core/response/IResponse"
import User from "../../../model/User"
import { launch } from "../../../core/common/launch"
import Profile from "../../../model/profile/Profile"
import CommonError from "../../../core/exceptions/constants/common-error.enum"
import { FileInterceptor } from "@nestjs/platform-express"
import UploadImageUtils from "../../../utils/multer/UploadImageUtils"
import UpdateProfileForm from "../../../model/form/update/UpdateProfileForm"
import UpdateProfileFormValidator from "../../../utils/validator/update-profile/UpdateProfileFormValidator"

/**
 * Class for "v1/me" controller
 * @author orbitalno11 2021 A.D.
 */
@Controller("v1/me")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class MeController {
    constructor(private readonly service: MeService) {
    }

    private readonly COIN_TAB_PAYMENT = 101
    private readonly COIN_TAB_TRANSACTION = 102
    private readonly COIN_TAB_TRANSFER = 103
    private readonly COIN_TAB_REDEEM = 104

    /**
     * Get user profile data
     * @param currentUser
     */
    @Get()
    getUserProfile(@CurrentUser() currentUser: User): Promise<IResponse<Profile | null>> {
        return launch(async () => {
            const profile = await this.service.getUserProfile(currentUser)
            return SuccessResponse.create(profile)
        })
    }

    /**
     * update user profile data
     * @param currentUser
     * @param body
     * @param file
     */
    @Post()
    @UseInterceptors(FileInterceptor("image", new UploadImageUtils().uploadImage2MbProperty("profile")))
    updateUserProfile(
        @CurrentUser() currentUser: User,
        @Body() body: UpdateProfileForm,
        @UploadedFile() file: Express.Multer.File
    ): Promise<IResponse<Profile | null>> {
        return launch(async () => {
            const data = UpdateProfileForm.createFromBody(body)
            const validator = new UpdateProfileFormValidator(currentUser.role)
            validator.setData(data)
            const validate = validator.validate()

            if (!validate.valid) {
                logger.error("data is invalid")
                throw FailureResponse.create(CommonError.VALIDATE_DATA, HttpStatus.BAD_REQUEST)
            }

            await this.service.updateUserProfile(currentUser, data, file)

            const userProfile = await this.service.getUserProfile(currentUser)
            return SuccessResponse.create(userProfile)
        })
    }

    /**
     * Get an user address data
     * @param currentUserId
     */
    @Get("address")
    getUserAddress(@CurrentUser("id") currentUserId: string): Promise<IResponse<Address[]>> {
        return launch(async () => {
            const result = await this.service.getUserAddress(currentUserId)
            return SuccessResponse.create(result)
        })
    }

    /**
     * Create or update an user address data
     * @param body
     * @param currentUserId
     */
    @Post("address")
    updateUserAddress(@Body() body: AddressForm, @CurrentUser("id") currentUserId: string): Promise<IResponse<string>> {
        return launch(async () => {
            const data = AddressForm.createFromBody(body)
            const validator = new AddressFormValidator(data)
            const validateResult = validator.validator()

            if (!validateResult.valid) {
                logger.error("Address data is invalid")
                throw FailureResponse.create(CommonError.VALIDATE_DATA, HttpStatus.BAD_REQUEST, validateResult.error)
            }

            await this.service.updateUserAddress(currentUserId, AddressFormToAddressMapper(data))

            return SuccessResponse.create("Successfully")
        })
    }

    @Get("coin")
    getCoinHistory(@CurrentUser() currentUser: User, @Query("tab") tab: number) {
        return launch( async () => {

        })
    }
}