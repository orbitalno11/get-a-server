import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import ErrorExceptions from '../ErrorExceptions';
import { logger } from "../../logging/Logger"

@Catch(ErrorExceptions)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: ErrorExceptions<any>, host: ArgumentsHost) {
    logger.error(exception)
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: exception.type,
      data: null,
      success: false,
    });
  }
}
