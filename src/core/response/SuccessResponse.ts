import IResponse from "./IResponse";

class SuccessResponse<T> implements IResponse<T>{
  message: string;
  data: T;
  success: boolean;
  statusCode: number;

  constructor(data: T, msg: string, isSuccess: boolean, code: number) {
    this.message = msg;
    this.data = data;
    this.success = isSuccess;
    this.statusCode = code;
  }

  public static create<U>(
    data: U,
    msg = 'Your work was done.',
    isSuccess = true,
    code = 200,
  ): SuccessResponse<U> {
    return new SuccessResponse(data, msg, isSuccess, code);
  }
}

export default SuccessResponse;
