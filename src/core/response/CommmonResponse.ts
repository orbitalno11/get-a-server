import IResponse from "./IResponse"

class CommonResponse<T> implements IResponse<T>{
  message: string;
  data: T;
  success: boolean;

  constructor(msg: string, data: T, success: boolean) {
    this.message = msg;
    this.data = data;
    this.success = success;
  }
}

export default CommonResponse;
