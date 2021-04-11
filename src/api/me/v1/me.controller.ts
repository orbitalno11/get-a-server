import {MeService} from "./me.service";
import {Body, Controller, Get, HttpStatus, Post, UseFilters, UseInterceptors} from "@nestjs/common";
import {FailureResponseExceptionFilter} from "../../../core/exceptions/filters/FailureResponseException.filter";
import {ErrorExceptionFilter} from "../../../core/exceptions/filters/ErrorException.filter";
import {TransformSuccessResponse} from "../../../interceptors/TransformSuccessResponse.interceptor";
import AddressForm from "../../../model/location/AddressForm";
import {CurrentUser} from "../../../decorator/CurrentUser.decorator";
import {logger} from "../../../core/logging/Logger";
import FailureResponse from "../../../core/response/FailureResponse";
import ErrorExceptions from "../../../core/exceptions/ErrorExceptions";
import {AddressFormValidator} from "../../../utils/validator/update-profile/AddressFormValidator";
import {AddressFormToAddressMapper} from "../../../utils/mapper/location/AddressFormToAddressMapper";
import {MemberAddressToAddressMapper} from "../../../utils/mapper/location/MemberAddressToAddressMapper";
import SuccessResponse from "../../../core/response/SuccessResponse";
import Address from "../../../model/location/Address";
import IResponse from "../../../core/response/IResponse";

/**
 * @author orbitalno11 2021 A.D.
 */
@Controller("v1/me")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class MeController {
    constructor(private readonly service: MeService) {
    }

    /**
     * Get an user address data
     * @param currentUserId
     */
    @Get("address")
    async getUserAddress(@CurrentUser("id") currentUserId: string): Promise<IResponse<Address[]>> {
        try {
            const result = await this.service.getUserAddress(currentUserId)
            const addressList = result.map(data => MemberAddressToAddressMapper(data))
            return SuccessResponse.create(addressList)
        } catch (error) {
            logger.error(error)
            if (error instanceof FailureResponse || error instanceof ErrorExceptions) throw error
            throw FailureResponse.create(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    /**
     * Create or update an user address data
     * @param body
     * @param currentUserId
     */
    @Post("address")
    async updateUserAddress(@Body() body: AddressForm, @CurrentUser("id") currentUserId: string) {
        try {
            const data = AddressForm.createFromBody(body)
            const validator = new AddressFormValidator(data)
            const validateResult = validator.validator()

            if (!validateResult.valid) {
                logger.error("Address data is invalid")
                throw FailureResponse.create("Address data is invalid", HttpStatus.BAD_REQUEST, validateResult.error)
            }

            await this.service.updateUserAddress(currentUserId, AddressFormToAddressMapper(data))

            return SuccessResponse.create("Successfully")
        } catch (error) {
            logger.error(error)
            if (error instanceof FailureResponse || error instanceof ErrorExceptions) throw error
            throw FailureResponse.create(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}