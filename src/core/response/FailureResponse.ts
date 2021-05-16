import IResponse from "./IResponse"

class FailureResponse<T> extends Error implements IResponse<T> {
    message: string
    data: T | null
    success: boolean
    statusCode: number

    constructor(msg: string, code: number, data: T | null, isSuccess: boolean) {
        super(msg)
        this.message = msg
        this.data = data
        this.success = isSuccess
        this.statusCode = code
    }

    public static create<U>(
        msg: string,
        code = 500,
        data: U | null = null,
        isSuccess = false
    ): FailureResponse<U> {
        return new FailureResponse(msg, code, data, isSuccess)
    }
}

export default FailureResponse
