import { Controller, Get, HttpStatus, Query, UseFilters, UseInterceptors } from "@nestjs/common"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import { FavoriteService } from "./favorite.service"
import IResponse from "../../../core/response/IResponse"
import { launch } from "../../../core/common/launch"
import SuccessResponse from "../../../core/response/SuccessResponse"
import { logger } from "../../../core/logging/Logger"
import FailureResponse from "../../../core/response/FailureResponse"
import CommonError from "../../../core/exceptions/constants/common-error.enum"
import { CurrentUser } from "../../../decorator/CurrentUser.decorator"
import User from "../../../model/User"
import TutorCard from "../../../model/profile/TutorCard"
import UserUtil from "../../../utils/UserUtil"
import { FavoriteError } from "../../../core/exceptions/constants/favorite-error.enum"
import { ApiTags } from "@nestjs/swagger"

/**
 * Controller for "v1/favorite"
 * @author orbitalno11 2021 A.D.
 */
@ApiTags("favorite")
@Controller("v1/favorite")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class FavoriteController {
    constructor(
        private readonly service: FavoriteService,
        private readonly userUtil: UserUtil
    ) {
    }

    /**
     * Like and unlike tutor by tutor id
     * @param userId
     * @param like
     * @param currentUser
     */
    @Get()
    likeTutor(
        @Query("tutor") userId: string,
        @Query("like") like: string,
        @CurrentUser() currentUser: User
    ): Promise<IResponse<string>> {
        return launch(async () => {
            if (!userId?.isSafeNotBlank() || !like?.isSafeNotBlank() || !like?.isBoolean()) {
                logger.error("Request data is invalid")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }

            const isLiked = await this.userUtil.isLiked(currentUser.id, userId)
            if (like === "true") {
                if (!isLiked) {
                    await this.service.likeTutor(userId, currentUser.id)
                } else {
                    throw FailureResponse.create(FavoriteError.ALREADY_LIKE_TUTOR, HttpStatus.BAD_REQUEST)
                }
            } else {
                if (isLiked) {
                    await this.service.unLikeTutor(userId, currentUser.id)
                } else {
                    throw FailureResponse.create(FavoriteError.NEVER_LIKE_TUTOR, HttpStatus.BAD_REQUEST)
                }
            }

            return SuccessResponse.create("Successful")
        })
    }

    /**
     * Get favorite tutor list
     * @param currentUser
     */
    @Get("list")
    getFavoriteList(@CurrentUser() currentUser: User): Promise<IResponse<TutorCard[]>> {
        return launch(async () => {
            const favorites = await this.service.getFavoriteTutorList(currentUser)
            return SuccessResponse.create(favorites)
        })
    }

}