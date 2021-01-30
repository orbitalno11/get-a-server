enum DatabaseTable {
    MEMBER_TABLE = "member"
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