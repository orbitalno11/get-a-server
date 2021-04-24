interface IResponse<T> {
    message: string
    data: T
    success: boolean
}

export default IResponse