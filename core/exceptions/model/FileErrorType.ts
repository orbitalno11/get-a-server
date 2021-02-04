enum FileErrorType {
    // upload
    FILE_NOT_ALLOW = "file-not-allow",
    FILE_SIZE_IS_TOO_LARGE = "file-size-is-too-large",
    CAN_NOT_CREATE_DIRECTORY = "cannot-create-directory",
    
    // delete
    CANNOT_DELETE_FILE = "cannot-delete-file",

    CANNOT_CONVERT_FILE_TO_WEBP = "cannot-convert-file-to-webp"
}

export default FileErrorType