declare global {
    interface String {
        isSafeNotNull(): boolean
        isNotSafeNull(): boolean
        isBlank(): boolean
        isNotBlank(): boolean
    }
}

String.prototype.isSafeNotNull = function(): boolean {
    return this !== null && String && this !== undefined && this.isNotBlank()
}

String.prototype.isNotSafeNull = function(): boolean {
    return this == null || this == undefined || this.trim().length === 0
}

String.prototype.isBlank = function(): boolean {
    return this.trim().length === 0
}

String.prototype.isNotBlank = function(): boolean {
    return !this.isBlank()
}

export {}