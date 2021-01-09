enum UserRoleKey {
  // key
  ADMIN = 0,
  LEARNER = 1,
  TUTOR = 2,
  TUTOR_LEARNER = 3,
  VISITOR = 4
}

enum UserRoleValue {
  // value
  ADMIN_TITLE = 'admin',
  LEARNER_TITLE = 'learner',
  TUTOR_TITLE = 'tutor',
  TUTOR_LEARNER_TITLE = 'tutor-learner',
  VISITOR_TITLE = 'visitor'
}

export {
  UserRoleKey,
  UserRoleValue
}
