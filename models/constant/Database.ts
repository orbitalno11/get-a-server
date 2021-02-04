enum DatabaseTable {
    MEMBER_TABLE = "member",
    MEMBER_ROLE_TABLE = "member_role"
}

enum DatabaseError {
    PROTOCOL_CONNECTION_LOST = "PROTOCOL_CONNECTION_LOST",
    ER_CON_COUNT_ERROR = "ER_CON_COUNT_ERROR",
    ECONNREFUSED = "ECONNREFUSED"
}

export {
    DatabaseTable,
    DatabaseError
}