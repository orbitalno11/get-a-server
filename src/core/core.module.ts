import { Module } from '@nestjs/common';
import { ErrorExceptionFilter } from './exceptions/filters/ErrorException.filter';
import { FailureResponseExceptionFilter } from './exceptions/filters/FailureResponseException.filter';
import { UnexpectedExceptionFilter } from './exceptions/filters/UnexpectedException.filter';

@Module({
  providers: [
    ErrorExceptionFilter,
    FailureResponseExceptionFilter,
    UnexpectedExceptionFilter,
  ],
  exports: [
    ErrorExceptionFilter,
    FailureResponseExceptionFilter,
    UnexpectedExceptionFilter,
  ],
})
export class CoreModule {}
