import { Body, Controller, HttpStatus, Post, Req, UseFilters, UseInterceptors } from "@nestjs/common"
import { OfflineCourseService } from "./OfflineCourse.service"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import OfflineCourseForm from "../../../model/course/OfflineCourseForm"
import { logger } from "../../../core/logging/Logger"
import FailureResponse from "../../../core/response/FailureResponse"
import OfflineCourseFormValidator from "../../../utils/validator/offline-course/OfflineCourseFormValidator"
import SuccessResponse from "../../../core/response/SuccessResponse"

@Controller("v1/offline-course")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class OfflineCourseController {
  constructor(private readonly service: OfflineCourseService) {
  }

  @Post("create")
  async createOfflineCourse(@Req() req: Express.Request, @Body() body: OfflineCourseForm) {
    try {
      const userId = req.currentUser.id

      if (!userId.isSafeNotNull()) {
        logger.error("user is invalid")
        throw FailureResponse.create("Can not found user", HttpStatus.BAD_REQUEST)
      }

      const data = OfflineCourseForm.createFromBody(body)
      const validator = new OfflineCourseFormValidator()
      validator.setData(data)
      const validate = validator.validate()

      if (!validate.valid) {
        logger.error("data is invalid")
        throw FailureResponse.create("Course data is invalid", HttpStatus.BAD_REQUEST, validate.error)
      }

      const courseId = await this.service.createOfflineCourse(userId, data)

      return SuccessResponse.create(courseId)
    } catch (error) {
      logger.error(error)
      if (error instanceof FailureResponse) throw error
      throw FailureResponse.create(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
