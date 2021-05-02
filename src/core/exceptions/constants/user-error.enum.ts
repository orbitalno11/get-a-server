enum UserError {
  EMAIL_ALREADY_EXITS = 'email-already-exits',
  CAN_NOT_CREATE = 'can-not-create-user',
  CAN_NOT_FIND = 'can-not-find-user',
  CAN_NOT_UPDATE_EMAIL = 'can-not-update-user-email',
  CAN_NOT_DELETE = 'can-not-delete-user',
  CAN_NOT_FOUND_ID = "can-not-found-user-id",
  CAN_NOT_GET_ADDRESS = "can-not-get-address",
  DO_NOT_HAVE_PERMISSION = "do-not-have-permission"
}

export default UserError;
