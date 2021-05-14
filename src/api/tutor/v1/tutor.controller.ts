import { Express } from "express"
import {
    Body,
    Controller, Delete,
    Get,
    HttpStatus,
    Param, Patch,
    Post, Put,
    UploadedFile,
    UseFilters,
    UseInterceptors
} from "@nestjs/common"
import { ErrorExceptionFilter } from "../../../core/exceptions/filters/ErrorException.filter"
import { FailureResponseExceptionFilter } from "../../../core/exceptions/filters/FailureResponseException.filter"
import { logger } from "../../../core/logging/Logger"
import SuccessResponse from "../../../core/response/SuccessResponse"
import { TransformSuccessResponse } from "../../../interceptors/TransformSuccessResponse.interceptor"
import TutorForm from "../../../model/form/register/TutorForm"
import { TutorService } from "./tutor.service"
import { FileInterceptor } from "@nestjs/platform-express"
import FailureResponse from "../../../core/response/FailureResponse"
import TutorRegisterFormValidator from "../../../utils/validator/register/TutorRegisterFormValidator"
import { isEmpty } from "../../../core/extension/CommonExtension"
import TutorProfile from "../../../model/profile/TutorProfile"
import { TutorEntityToTutorProfile } from "../../../utils/mapper/tutor/TutorEntityToTutorProfileMapper"
import { CurrentUser } from "../../../decorator/CurrentUser.decorator"
import { launch } from "../../../core/common/launch"
import CommonError from "../../../core/exceptions/constants/common-error.enum"
import FileError from "../../../core/exceptions/constants/file-error.enum"
import UserError from "../../../core/exceptions/constants/user-error.enum"
import { UploadFileUtils } from "../../../utils/multer/UploadFileUtils"
import EducationVerifyForm from "../../../model/education/EducationVerifyForm"
import User from "../../../model/User"
import EducationVerifyFormValidator from "../../../utils/validator/verify/EducationVerifyFormValidator"
import IResponse from "../../../core/response/IResponse"
import TestingVerifyForm from "../../../model/education/TestingVerifyForm"
import TestingVerifyFormValidator from "../../../utils/validator/verify/TestingVerifyFormValidator"
import Education from "../../../model/education/Education"
import EducationVerification from "../../../model/education/EducationVerification"
import ExamResult from "../../../model/education/ExamResult"
import TestingVerification from "../../../model/education/TestingVerification"
import PublicProfile from "../../../model/profile/PublicProfile"
import SimpleOfflineCourse from "../../../model/course/SimpleOfflineCourse"

@Controller("v1/tutor")
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class TutorController {
    constructor(private readonly tutorService: TutorService) {
    }

    @Post("create")
    @UseInterceptors(FileInterceptor("image", new UploadFileUtils().uploadImage2MbProperty()))
    createTutor(@UploadedFile() file: Express.Multer.File, @Body() body: TutorForm): Promise<SuccessResponse<string>> {
        return launch(async () => {
            const data = TutorForm.createFromBody(body)
            const validator = new TutorRegisterFormValidator()
            validator.setData(data)
            const validate = validator.validate()

            if (!validate.valid) {
                logger.error("validation error")
                throw FailureResponse.create(CommonError.VALIDATE_DATA, HttpStatus.NOT_ACCEPTABLE, validate.error)
            }

            if (file === undefined || file === null) {
                logger.error("upload file is invalid:" + file)
                throw FailureResponse.create(FileError.NOT_FOUND, HttpStatus.NOT_FOUND)
            }

            const result = await this.tutorService.createTutor(data, file)

            return SuccessResponse.create(result)
        })
    }

    /**
     * Get public tutor profile
     * @param id
     */
    @Get(":id")
    getProfileById(@Param("id") id: string): Promise<SuccessResponse<PublicProfile>> {
        return launch(async () => {
            if (!id?.isSafeNotNull()) {
                logger.error("Can not found user id")
                throw FailureResponse.create(UserError.CAN_NOT_FOUND_ID, HttpStatus.NOT_FOUND)
            }

            const profile = await this.tutorService.getProfileById(id)

            return SuccessResponse.create(profile)
        })
    }

    /**
     * Get tutor offline course
     * @param userId
     * @param currentUser
     */
    @Get(":id/offline-course")
    getOfflineCourse(@Param("id") userId: string, @CurrentUser() currentUser: User): Promise<IResponse<SimpleOfflineCourse[]>> {
        return launch(async () => {
            if (!userId?.isSafeNotBlank()) {
                logger.error("Invalid data")
                throw FailureResponse.create(CommonError.INVALID_REQUEST_DATA, HttpStatus.BAD_REQUEST)
            }

            const courses = await this.tutorService.getOfflineCourse(userId, currentUser)

            return SuccessResponse.create(courses)
        })
    }

    /**
     * Get tutor education list
     * @param id
     * @param currentUser
     */
    @Get(":id/educations")
    getEducations(@Param("id") id: string, @CurrentUser() currentUser: User): Promise<IResponse<Education[]>> {
        return launch(async () => {
            if (!id?.isSafeNotBlank()) {
                throw FailureResponse.create(CommonError.INVALID, HttpStatus.BAD_REQUEST)
            }

            const educations = await this.tutorService.getEducations(id, currentUser)
            return SuccessResponse.create(educations)
        })
    }

    /**
     * Get tutor testing list
     * @param id
     * @param currentUser
     */
    @Get(":id/testings")
    getTestings(@Param("id") id: string, @CurrentUser() currentUser: User): Promise<IResponse<ExamResult[]>> {
        return launch(async () => {
            if (!id?.isSafeNotBlank()) {
                throw FailureResponse.create(CommonError.INVALID, HttpStatus.BAD_REQUEST)
            }

            const testings = await this.tutorService.getTestings(id, currentUser)
            return SuccessResponse.create(testings)
        })
    }

    /**
     * Tutor request education verification
     * @param body
     * @param file
     * @param currentUser
     */
    @Post("education/verify")
    @UseInterceptors(FileInterceptor("file", new UploadFileUtils().uploadImage()))
    requestEducationVerify(
        @Body() body: EducationVerifyForm,
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() currentUser: User
    ): Promise<IResponse<string>> {
        return launch(async () => {
            const data = EducationVerifyForm.createFormBody(body)
            const validator = new EducationVerifyFormValidator()
            validator.setData(data)
            const validate = validator.validate()

            if (!validate.valid) {
                logger.error("validation error")
                throw FailureResponse.create(CommonError.VALIDATE_DATA, HttpStatus.BAD_REQUEST, validate.error)
            }

            if (!file) {
                logger.error("upload file is invalid:" + file)
                throw FailureResponse.create(FileError.NOT_FOUND, HttpStatus.BAD_REQUEST)
            }

            const result = await this.tutorService.requestEducationVerification(currentUser, data, file)
            return SuccessResponse.create(result)
        })
    }

    /**
     * Get education with verification data
     * @param id
     * @param currentUser
     */
    @Get("education/:id")
    getEducation(@Param("id") id: string, @CurrentUser() currentUser: User): Promise<IResponse<EducationVerification>> {
        return launch(async () => {
            const education = await this.tutorService.getEducation(id, currentUser)
            return SuccessResponse.create(education)
        })
    }

    /**
     * Update education verification data
     * @param id
     * @param currentUser
     * @param body
     * @param file
     */
    @Put("education/:id")
    @UseInterceptors(FileInterceptor("file", new UploadFileUtils().uploadImage()))
    updateEducation(
        @Param("id") id: string,
        @CurrentUser() currentUser: User,
        @Body() body: EducationVerifyForm,
        @UploadedFile() file: Express.Multer.File
    ): Promise<IResponse<string>> {
        return launch(async () => {
            const data = EducationVerifyForm.createFormBody(body)

            const validator = new EducationVerifyFormValidator()
            validator.setData(data)
            const validate = validator.validate()

            if (!validate.valid) {
                logger.error("validation error")
                throw FailureResponse.create(CommonError.VALIDATE_DATA, HttpStatus.BAD_REQUEST, validate.error)
            }

            const result = await this.tutorService.updateEducationVerification(id, currentUser, data, file)
            return SuccessResponse.create(result)
        })
    }

    /**
     * Delete education verification data
     * @param id
     * @param currentUser
     */
    @Delete("education/:id")
    deleteEducation(@Param("id") id: string, @CurrentUser() currentUser: User) {
        return launch(async () => {
            await this.tutorService.deleteEducation(id, currentUser)
            return SuccessResponse.create("Successful")
        })
    }

    /**
     * Tutor request testing verification
     * @param body
     * @param file
     * @param currentUser
     */
    @Post("testing/verify")
    @UseInterceptors(FileInterceptor("file", new UploadFileUtils().uploadImage()))
    requestTestingVerify(
        @Body() body: TestingVerifyForm,
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() currentUser: User
    ): Promise<IResponse<string>> {
        return launch(async () => {
            const data = TestingVerifyForm.createFormBody(body)
            const validator = new TestingVerifyFormValidator()
            validator.setData(data)
            const validate = validator.validate()

            if (!validate.valid) {
                logger.error("validation error")
                throw FailureResponse.create(CommonError.VALIDATE_DATA, HttpStatus.BAD_REQUEST, validate.error)
            }

            if (!file) {
                logger.error("upload file is invalid:" + file)
                throw FailureResponse.create(FileError.NOT_FOUND, HttpStatus.BAD_REQUEST)
            }

            const result = await this.tutorService.createTestingVerificationData(currentUser, data, file)
            return SuccessResponse.create(result)
        })
    }

    /**
     * Get testing with verification data
     * @param id
     * @param currentUser
     */
    @Get("testing/:id")
    getTesting(@Param("id") id: string, @CurrentUser() currentUser: User): Promise<IResponse<TestingVerification>> {
        return launch(async () => {
            const testing = await this.tutorService.getTesting(id, currentUser)
            return SuccessResponse.create(testing)
        })
    }

    /**
     * Update testing verification data
     * @param id
     * @param body
     * @param file
     * @param currentUser
     */
    @Put("testing/:id")
    @UseInterceptors(FileInterceptor("file", new UploadFileUtils().uploadImage()))
    updateTestingVerificationData(
        @Param("id") id,
        @Body() body: TestingVerifyForm,
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() currentUser: User
    ): Promise<IResponse<string>> {
        return launch(async () => {
            const data = TestingVerifyForm.createFormBody(body)
            const validator = new TestingVerifyFormValidator()
            validator.setData(data)
            const validate = validator.validate()

            if (!validate.valid) {
                logger.error("validation error")
                throw FailureResponse.create(CommonError.VALIDATE_DATA, HttpStatus.BAD_REQUEST, validate.error)
            }

            const result = await this.tutorService.updateTestingVerificationData(id, currentUser, data, file)
            return SuccessResponse.create(result)
        })
    }

    /**
     * Delete testing verification data
     * @param id
     * @param currentUser
     */
    @Delete("testing/:id")
    deleteTestingVerificationData(@Param("id") id: string, @CurrentUser() currentUser: User): Promise<IResponse<string>> {
        return launch(async () => {
            await this.tutorService.deleteTestingVerificationData(id, currentUser)
            return SuccessResponse.create("Successful")
        })
    }
}
