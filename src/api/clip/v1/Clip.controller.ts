import {
    Body,
    Controller, Delete, Get,
    HttpStatus, Param,
    Post, Put,
    UploadedFile,
    UseFilters,
    UseInterceptors
} from "@nestjs/common"
import { ClipService } from "./Clip.service"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import { FileInterceptor } from "@nestjs/platform-express"
import { UploadFileUtils } from "../../../utils/multer/UploadFileUtils"
import ClipForm from "../../../model/clip/ClipForm"
import { launch } from "../../../core/common/launch"
import ClipFormValidator from "../../../utils/validator/clip/ClipFormValidator"
import { logger } from "../../../core/logging/Logger"
import FailureResponse from "../../../core/response/FailureResponse"
import CommonError from "../../../core/exceptions/constants/common-error.enum"
import { isEmpty } from "../../../core/extension/CommonExtension"
import { CurrentUser } from "../../../decorator/CurrentUser.decorator"
import User from "../../../model/User"
import SuccessResponse from "../../../core/response/SuccessResponse"
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiHeader, ApiInternalServerErrorResponse, ApiOkResponse,
    ApiResponse,
    ApiTags
} from "@nestjs/swagger"
import ClipDetail from "../../../model/clip/ClipDetail"
import IResponse from "../../../core/response/IResponse"

/**
 * Controller class for "v1/clip" API
 * @author orbitalno11 2021 A.D.
 */
@ApiTags("clip")
@Controller("v1/clip")
@UseFilters(ErrorExceptionFilter, FailureResponseExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class ClipController {
    constructor(private readonly service: ClipService) {
    }

    /**
     * Create clip detail and upload clip
     * @param body
     * @param file
     * @param currentUser
     */
    @Post("create")
    @UseInterceptors(FileInterceptor("video", new UploadFileUtils().uploadHdVideo()))
    @ApiHeader({
        name: "Authorization",
        description: "get-a tutor token"
    })
    @ApiCreatedResponse({ description: "clip id" })
    createClip(
        @Body() body: ClipForm,
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() currentUser: User
    ): Promise<IResponse<string>> {
        return launch(async () => {
            const data = ClipForm.createFormBody(body)
            const validator = new ClipFormValidator(data)
            const { valid, error } = validator.validate()

            if (!valid) {
                logger.error("Invalid request data")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST, error)
            }

            if (isEmpty(file)) {
                logger.error("Invalid video")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST, "Video is not found")
            }

            const clipId = await this.service.createClip(data, file, currentUser)

            return SuccessResponse.create(clipId)
        })
    }

    /**
     * Buy clip
     * @param clipId
     * @param currentUser
     */
    @Get(":id/buy")
    @ApiHeader({
        name: "Authorization",
        description: "get-a learner token"
    })
    @ApiOkResponse({ description: "Successful" })
    @ApiBadRequestResponse({ description: "Invalid clip id" })
    @ApiInternalServerErrorResponse({ description: "Your already buy this clip" })
    @ApiInternalServerErrorResponse({ description: "Your coin is not enough" })
    @ApiInternalServerErrorResponse({ description: "Cna not buy clip" })
    buyClip(@Param("id") clipId: string, @CurrentUser() currentUser: User): Promise<IResponse<string>> {
        return launch(async () => {
            if (!clipId?.isSafeNotBlank()) {
                logger.error("Invalid clip id")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }

            await this.service.buyClip(clipId, currentUser)

            return SuccessResponse.create("Successful")
        })
    }

    /**
     * Get clip detail by clip id
     * @param clipId
     */
    @Get(":id")
    @ApiResponse({ status: HttpStatus.OK, description: "clip detail", type: ClipDetail })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid request data" })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: "Can not get clip" })
    getClip(@Param("id") clipId: string) {
        return launch(async () => {
            if (!clipId?.isSafeNotBlank()) {
                logger.error("Invalid clip id")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }

            const clip = await this.service.getClipById(clipId)
            return SuccessResponse.create(clip)
        })
    }

    /**
     * Update clip detail
     * @param clipId
     * @param body
     * @param file
     * @param currentUser
     */
    @Put(":id")
    @UseInterceptors(FileInterceptor("video", new UploadFileUtils().uploadHdVideo()))
    @ApiHeader({
        name: "Authorization",
        description: "get-a tutor token"
    })
    @ApiCreatedResponse({ description: "clip id" })
    @ApiBadRequestResponse({ description: "Invalid clip id" })
    @ApiBadRequestResponse({ description: "Invalid request data" })
    @ApiInternalServerErrorResponse({ description: "Can not update clip detail" })
    updateClipDetail(
        @Param("id") clipId: string,
        @Body() body: ClipForm,
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() currentUser: User
    ): Promise<IResponse<string>> {
        return launch(async () => {
            if (!clipId?.isSafeNotBlank()) {
                logger.error("Invalid clip id")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }

            const data = ClipForm.createFormBody(body)
            const validator = new ClipFormValidator(data)
            const { valid, error } = validator.validate()

            if (!valid) {
                logger.error("Invalid request data")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST, error)
            }

            const result = await this.service.updateClip(clipId, data, currentUser, file)

            return SuccessResponse.create(result)
        })
    }

    /**
     * Delete clip by clip id
     * @param clipId
     * @param currentUser
     */
    @Delete(":id")
    @ApiHeader({
        name: "Authorization",
        description: "get-a tutor token"
    })
    @ApiOkResponse({ description: "Successful" })
    @ApiBadRequestResponse({ description: "Invalid clip id" })
    @ApiInternalServerErrorResponse({ description: "Can not found clip data" })
    @ApiInternalServerErrorResponse({ description: "Can not delete clip data" })
    @ApiInternalServerErrorResponse({ description: "Can not delete clip" })
    deleteClip(@Param("id") clipId: string, @CurrentUser() currentUser: User): Promise<IResponse<string>> {
        return launch(async () => {
            if (!clipId?.isSafeNotBlank()) {
                logger.error("Invalid clip id")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }

            await this.service.deleteClip(clipId, currentUser)

            return SuccessResponse.create("Successful")
        })
    }
}