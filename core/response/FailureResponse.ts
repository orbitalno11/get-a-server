class FailureResponse<T> extends Error {
    message: string
    data: T | null
    success: boolean
    statusCode: number

    constructor(msg: string, code: number = 200, data: T | null = null, isSuccess: boolean = false) {
        super(msg)
        this.message = msg
        this.data = data
        this.success = isSuccess
        this.statusCode = code
    }
}

export default FailureResponse