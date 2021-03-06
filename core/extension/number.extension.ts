declare global {
    interface Number {
        isSafeNumber(): boolean
        isPositiveValue(): boolean
        isNegativeValue(): boolean
        isZeroValue(): boolean
    }
}


Number.prototype.isSafeNumber = function(): boolean {
    return this !== null && this !== undefined && this !== NaN
}

Number.prototype.isPositiveValue = function(): boolean {
    return this.isSafeNumber() && this > 0
}

Number.prototype.isNegativeValue = function(): boolean {
    return this.isSafeNumber() && this < 0
}

Number.prototype.isZeroValue = function(): boolean {
    return this.isSafeNumber() && this === 0
}

export {}