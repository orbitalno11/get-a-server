import {
  Controller,
  Get,
  HttpStatus,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ErrorExceptionFilter } from '../../../core/exceptions/filters/ErrorException.filter';
import { FailureResponseExceptionFilter } from '../../../core/exceptions/filters/FailureResponseException.filter';
import { logger } from '../../../core/logging/Logger';
import FailureResponse from '../../../core/response/FailureResponse';
import SuccessResponse from '../../../core/response/SuccessResponse';
import { TransformSuccessResponse } from '../../../interceptors/TransformSuccessResponse.interceptor';
import { AuthenticationService } from './authentication.service';

@Controller('v1/auth')
@UseFilters(FailureResponseExceptionFilter, ErrorExceptionFilter)
@UseInterceptors(TransformSuccessResponse)
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Get('token')
  async getToken(
    @Query('token') token: string,
  ): Promise<SuccessResponse<string>> {
    try {
      if (!token?.isSafeNotNull()) {
        throw FailureResponse.create(
          'Can not found token',
          HttpStatus.NOT_FOUND,
        );
      }
      const generateToken = await this.authService.getToken(token);
      return SuccessResponse.create(generateToken);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
