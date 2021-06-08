// TODO refactor this to common.extemsion.ts like string.extension.ts

const isEmpty = (data: any): boolean =>
    data === null ||
    data === undefined ||
    (typeof data === "object" && Object.keys(data).length === 0) ||
    (typeof data === "string" && data.isBlank())

const isNotEmpty = (data: any): boolean => !isEmpty(data)

const isNotNull = (data: any): boolean => data !== null

const isSafeNotNull = (data: any): boolean =>
    isNotNull(data) && data !== undefined

const isValidDate = (data: Date): boolean => data instanceof Date && isNaN(data.getTime())

export { isEmpty, isNotEmpty, isNotNull, isSafeNotNull, isValidDate }
