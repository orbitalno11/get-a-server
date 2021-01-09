import ErrorExceptions from '../../core/exceptions/ErrorExceptions';
import ErrorType from '../../core/exceptions/model/ErrorType';
import { logger } from '../../core/logging/Logger';
import ValidateResult from './ValidateResult';

abstract class AbstractValidator<T> {
  protected form: T | null = null;
  errors = {} as any;
  isValid = false;

  setData(data: T) {
    this.form = data;
  }

  abstract validator(): ValidateResult<any>;

  validate(): ValidateResult<any> {
    try {
      return this.validator();
    } catch (error) {
      logger.error(error);
      throw new ErrorExceptions(
        'Error while validate data',
        ErrorType.VALIDATE_DATA,
      );
    }
  }
}

export default AbstractValidator;
