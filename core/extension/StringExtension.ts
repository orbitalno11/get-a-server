const isSafeNotNull = (str: string | null | undefined): boolean => (
    str !== null && str !== undefined && isNotBlank(str)
)

const isNotBlank = (str: string): boolean => (
    str !== ""
)

export {
    isNotBlank,
    isSafeNotNull
}