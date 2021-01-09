import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import CommonResponse from '../core/response/CommmonResponse';
import SuccessResponse from '../core/response/SuccessResponse';

@Injectable()
export class TransformSuccessResponse<T> implements NestInterceptor<SuccessResponse<T>, CommonResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<SuccessResponse<T>>,
  ): Observable<CommonResponse<T>> | Promise<Observable<CommonResponse<T>>> {
    return next
      .handle()
      .pipe(
        map(
          (value) =>
            new CommonResponse(value.message, value.data, value.success),
        ),
      );
  }
}
