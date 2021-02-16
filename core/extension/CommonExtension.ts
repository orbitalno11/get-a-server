// TODO refactor this to common.extemsion.ts like string.extension.ts

const isEmpty = (data: any): boolean => (
    data === null || data === undefined || 
    (typeof data === "object" && Object.keys(data).length === 0) || 
    (typeof data === "string" && data.isBlank())
)

const isNotEmpty = (data: any): boolean => (
    !isEmpty(data)
)

export {
    isEmpty,
    isNotEmpty
}