interface Number {
    isNotNull(): boolean
    isSafe(): boolean
    isSafeNotNull(): boolean
    isSafeNumber(): boolean
    isPositiveValue(): boolean
    isNegativeValue(): boolean
    isZeroValue(): boolean
    isNaN(): boolean
    isBewteen(min: number, max: number): boolean
}