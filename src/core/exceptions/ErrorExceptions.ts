class ErrorExceptions<T> extends Error {
  message: string;
  type: T;

  constructor(message: string, type: T) {
    super(message);
    this.message = message;
    this.type = type;
  }

  public static create<U>(message: string, type: U): ErrorExceptions<U> {
    return new ErrorExceptions<U>(message, type);
  }
}

export default ErrorExceptions;
