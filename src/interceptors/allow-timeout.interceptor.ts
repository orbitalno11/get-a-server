import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { Observable, throwError, TimeoutError } from "rxjs"
import { catchError, timeout } from "rxjs/operators"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import CommonError from "../core/exceptions/constants/common-error.enum"

@Injectable()
export class AllowTimeoutInterceptor implements NestInterceptor {
    constructor(private timeoutLimit: number = 30000) {
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            timeout(this.timeoutLimit),
            catchError(err => {
                if (err instanceof TimeoutError) {
                    return throwError(ErrorExceptions.create("Request timeout", CommonError.TIMEOUT))
                }
                return throwError(err)
            })
        )
    }
}