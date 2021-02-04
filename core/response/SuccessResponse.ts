class SuccessResponse<T> {
    message: string
    data: T
    success: boolean
    statusCode: number

    constructor(data: T, msg: string = "Your work was done.", isSuccess: boolean = true, code: number = 200) {
        this.message = msg
        this.data = data
        this.success = isSuccess
        this.statusCode = code
    }
}

export default SuccessResponse