enum UserErrorType {
    UNEXPECTED_ERROR = "unexpected-user-error",
    // create user
    EMAIL_ALREDY_EXITS = "email-already-exits",
    CAN_NOT_CREATE_USER = "cannot-create-user",

    CAN_NOT_FIND_USER = "cannot-find-user",

    CANNOT_UPDATE_USER_EMAIL = "cannot-update-user-email",
    CANNOT_DELETE_USER = "cannot-delete-user"
}

export default UserErrorType