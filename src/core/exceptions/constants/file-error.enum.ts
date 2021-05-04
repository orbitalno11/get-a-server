enum FileError {
    NOT_ALLOW = "file-not-allow",
    SIZE_IS_TOO_LARGE = "file-size-is-too-large",
    CAN_NOT_CREATE_DIRECTORY = "can-not-create-directory",
    CAN_NOT_UPLOAD_IMAGE_TO_STORAGE = "can-not-upload-image-to-storage",
    CAN_NOT_DELETE = "can-not-delete-file",
    CAN_NOT_CONVERT_PROFILE_IMAGE = "can-not-convert-profile-image",
    CAN_NOT_CONVERT_FILE_TO_WEBP = "can-not-convert-file-to-webp",
    CAN_NOT_RENAME = "can-not-rename-file",
    CAN_NOT_UPLOAD_TO_STORAGE = "can-not-upload-to-storage",
    NOT_FOUND = "file-not-found",
}

export default FileError
