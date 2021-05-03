enum UserError {
  CAN_NOT_CREATE = 'can-not-create-user',
  CAN_NOT_FIND = 'can-not-find-user',
  CAN_NOT_UPDATE_EMAIL = 'can-not-update-user-email',
  CAN_NOT_DELETE = 'can-not-delete-user',
  CAN_NOT_FOUND_ID = "can-not-found-user-id",
  CAN_NOT_GET_ADDRESS = "can-not-get-address",
  CAN_NOT_UPDATE = "can-not-update-user-profile",
  DO_NOT_HAVE_PERMISSION = "do-not-have-permission",
  EMAIL_ALREADY_EXITS = 'email-already-exits'
}

export default UserError;
