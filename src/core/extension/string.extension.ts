String.prototype.isSafeNotNull = function (): boolean {
    return this !== null && String && this !== undefined
}

String.prototype.isSafeNotBlank = function (): boolean {
    return this.isSafeNotNull() && this.isNotBlank()
}

String.prototype.isBlank = function (): boolean {
    return this.trim().length === 0
}

String.prototype.isNotBlank = function (): boolean {
    return !this.isBlank()
}

String.prototype.toNumber = function (): number {
    return Number(this)
}

String.prototype.isBoolean = function (): boolean {
    return Boolean(this)
}
