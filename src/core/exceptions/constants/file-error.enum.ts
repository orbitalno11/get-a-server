enum FileError {
    NOT_ALLOW = "file-not-allow",
    SIZE_IS_TOO_LARGE = "file-size-is-too-large",
    CAN_NOT_CREATE_DIRECTORY = "cannot-create-directory",
    CAN_NOT_UPLOAD_IMAGE_TO_STORAGE = "can-not-upload-image-to-storage",
    CANNOT_DELETE = "cannot-delete-file",
    CANNOT_CONVERT_PROFILE_IMAGE = "cannot-convert-profile-image",
    CANNOT_CONVERT_FILE_TO_WEBP = "cannot-convert-file-to-webp",
    CANNOT_RENAME = "cannot-rename-file",
    NOT_FOUND = "file-not-found",
}

export default FileError
