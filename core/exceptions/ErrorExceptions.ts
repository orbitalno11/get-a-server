class ErrorExceptions<T> extends Error {
    message: string
    type: T

    constructor(message: string, type: T) {
        super(message)
        this.message = message
        this.type = type
    }
}

export default ErrorExceptions