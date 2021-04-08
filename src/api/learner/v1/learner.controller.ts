import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post, Put,
  UploadedFile,
  UseFilters,
  UseInterceptors
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { logger } from "../../../core/logging/Logger"
import FailureResponse from "../../../core/response/FailureResponse"
import SuccessResponse from "../../../core/response/SuccessResponse"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import LearnerForm from "../../../model/form/register/LearnerForm"
import UploadImageUtils from "../../../utils/multer/UploadImageUtils"
import LearnerRegisterFromValidator from "../../../utils/validator/register/LearnerRegisterFormValidator"
import { LearnerService } from "./learner.service"
import { isEmpty } from "../../../core/extension/CommonExtension"
import { LearnerEntityToLearnerProfile } from "../../../utils/mapper/learner/LearnerEntityToLearnerProfile"
import LearnerProfile from "../../../model/profile/LearnerProfile"
import UploadImageUtil from "../../../utils/multer/UploadImageUtils"
import LearnerUpdateForm from "../../../model/form/update/LearnerUpdateForm"
import LearnerUpdateFormValidator from "../../../utils/validator/update-profile/LearnerUpdateFormValidator"
import { CurrentUser } from "../../../decorator/CurrentUser.decorator"

@Controller("v1/learner")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class LearnerController {
  constructor(private readonly learnerService: LearnerService) {
  }

  @Post("create")
  @UseInterceptors(
    FileInterceptor(
      "image",
      new UploadImageUtils().uploadImage2MbProperty("profile")
    )
  )
  async createLearner(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: LearnerForm
  ): Promise<SuccessResponse<string>> {
    try {
      const data = LearnerForm.createFromBody(body)
      const validator = new LearnerRegisterFromValidator()
      validator.setData(data)
      const validate = validator.validate()

      if (!validate.valid) {
        logger.error("validation error")
        throw FailureResponse.create(
          "Register data is invalid",
          HttpStatus.NOT_ACCEPTABLE,
          validate.error
        )
      }

      if (file === undefined || file === null) {
        logger.error("upload file is invalid:" + file)
        throw FailureResponse.create(
          "Please upload image file",
          HttpStatus.NOT_FOUND
        )
      }

      const result = await this.learnerService.createLearner(data, file)
      return SuccessResponse.create(result)
    } catch (error) {
      logger.error(error)
      if (error instanceof FailureResponse) throw error
      throw FailureResponse.create(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get(":id")
  async getProfileById(@Param("id") id: string, @CurrentUser("id") currentUserId: string): Promise<SuccessResponse<LearnerProfile | string>> {
    try {
      if (!id.isSafeNotNull()) {
        logger.error("Can not found user id")
        throw FailureResponse.create(
          "Can not found user id",
          HttpStatus.NOT_FOUND
        )
      }

      if (id !== currentUserId) {
        logger.error("You don't have permission")
        throw FailureResponse.create("You don't have permission", HttpStatus.UNAUTHORIZED)
      }

      const tutorData = await this.learnerService.getProfileById(id)

      if (isEmpty(tutorData)) {
        logger.info("Can not find user")
        return SuccessResponse.create("Can not find user")
      }

      return SuccessResponse.create(LearnerEntityToLearnerProfile(tutorData))
    } catch (error) {
      logger.error(error)
      if (error instanceof FailureResponse) throw error
      throw FailureResponse.create(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Put(":id")
  @UseInterceptors(FileInterceptor("image", new UploadImageUtil().uploadImage2MbProperty("profile")))
  async updateProfile(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: LearnerUpdateForm,
    @CurrentUser("id") currentUserId: string
  ) {
    try {
      if (!id.isSafeNotNull()) {
        logger.error("Can not found user id")
        throw FailureResponse.create("Can not found user id", HttpStatus.NOT_FOUND)
      }

      if (id !== currentUserId) {
        logger.error("You don't have permission")
        throw FailureResponse.create("You don't have permission", HttpStatus.UNAUTHORIZED)
      }

      const data = LearnerUpdateForm.createFromBody(body)
      const validator = new LearnerUpdateFormValidator()
      validator.setData(data)
      const validate = validator.validate()

      if (!validate.valid) {
        logger.error("validation error")
        throw FailureResponse.create(
          "Register data is invalid",
          HttpStatus.NOT_ACCEPTABLE,
          validate.error
        )
      }

      if (!validate.valid) {
        logger.error("validation error")
        throw FailureResponse.create("Update data is invalid", HttpStatus.NOT_ACCEPTABLE, validate.error)
      }

      const result = await this.learnerService.updateProfile(id, data, file)
      return SuccessResponse.create(result)
    } catch (error) {
      logger.error(error)
      if (error instanceof FailureResponse) throw error
      throw FailureResponse.create(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
