enum UserErrorType {
    UNEXPECTED_ERROR,
    // create user
    EMAIL_ALREDY_EXITS,
    CAN_NOT_CREATE_USER,

    CAN_NOT_FIND_USER,

    CANNOT_UPDATE_USER_EMAIL,
    CANNOT_DELETE_USER
}

export default UserErrorType