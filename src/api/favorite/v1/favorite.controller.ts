import { Controller, Get, HttpStatus, Query, UseFilters, UseInterceptors } from "@nestjs/common"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import { FavoriteService } from "./favorite.service"
import IResponse from "../../../core/response/IResponse"
import { launch } from "../../../core/common/launch"
import SuccessResponse from "../../../core/response/SuccessResponse"
import FailureResponse from "../../../core/response/FailureResponse"
import CommonError from "../../../core/exceptions/constants/common-error.enum"
import { CurrentUser } from "../../../decorator/CurrentUser.decorator"
import User from "../../../model/User"
import TutorCard from "../../../model/profile/TutorCard"
import {
    ApiBadRequestResponse, ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiTags
} from "@nestjs/swagger"

/**
 * Controller for "v1/favorite"
 * @author orbitalno11 2021 A.D.
 */
@ApiTags("favorite")
@Controller("v1/favorite")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class FavoriteController {
    constructor(private readonly service: FavoriteService) {
    }

    /**
     * Like and unlike tutor by tutor id
     * @param userId
     * @param currentUser
     */
    @Get()
    @ApiBearerAuth()
    @ApiOkResponse({ description: "Successful" })
    @ApiBadRequestResponse({ description: "Request data is invalid"})
    @ApiInternalServerErrorResponse({ description: "Can not like tutor by id"})
    @ApiInternalServerErrorResponse({ description: "Can not unlike tutor by id"})
    likeTutor(@Query("tutor") userId: string, @CurrentUser() currentUser: User): Promise<IResponse<string>> {
        return launch(async () => {
            if (!userId?.isSafeNotBlank()) {
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }

            await this.service.likedAction(userId, currentUser.id)

            return SuccessResponse.create("Successful")
        })
    }

    /**
     * Get favorite tutor list
     * @param currentUser
     */
    @Get("list")
    @ApiBearerAuth()
    @ApiOkResponse({ description: "tutor list", type: TutorCard })
    @ApiInternalServerErrorResponse({ description: "Can not get favorite list"})
    getFavoriteList(@CurrentUser() currentUser: User): Promise<IResponse<TutorCard[]>> {
        return launch(async () => {
            const favorites = await this.service.getFavoriteTutorList(currentUser)
            return SuccessResponse.create(favorites)
        })
    }

    /**
     * Check already like tutor
     * @param userId
     * @param currentUser
     */
    @Get("liked")
    @ApiBearerAuth()
    @ApiOkResponse({ description: "like status"})
    checkLikedTutor(@Query("tutor") userId: string, @CurrentUser() currentUser: User): Promise<IResponse<boolean>> {
        return launch(async () => {
            if (!userId?.isSafeNotBlank()) {
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }

            const liked = await this.service.isLiked(currentUser.id, userId)

            return SuccessResponse.create(liked)
        })
    }
}