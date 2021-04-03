import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import FailureResponse from '../../response/FailureResponse';

@Catch(FailureResponse)
export class FailureResponseExceptionFilter implements ExceptionFilter {
  catch(exception: FailureResponse<any>, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(exception.statusCode).json({
      message: exception.message,
      data: exception.data,
      success: exception.success,
    });
  }
}
