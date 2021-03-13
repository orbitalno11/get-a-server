// TODO redesign this
// interface Object {
//     isObjectEmpty(): boolean
//     isObjectNotEmpty(): boolean
// }

// Object.prototype.isObjectEmpty = function (): boolean {
//     return this === null || this === undefined || 
//     (typeof this === "object" && Object.keys(this).length === 0) || 
//     (typeof this === "string" && this.isNotBlank())
// }

// Object.prototype.isObjectNotEmpty = function (): boolean {
//     return !this.isObjectEmpty()
// }