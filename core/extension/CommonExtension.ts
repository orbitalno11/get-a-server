const isEmpty = (data: any): boolean => (
    data === null || data === undefined || data === "" || 
    (typeof data === 'object' && Object.keys(data).length === 0) || 
    (typeof data === 'string' && data.trim().length === 0)
)

const isNotEmpty = (data: any): boolean => (
    !isEmpty(data)
)

export {
    isEmpty,
    isNotEmpty
}