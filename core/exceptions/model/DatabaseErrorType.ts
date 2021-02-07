enum DatabaseErrorType {
    // connection
    PROTOCOL_CONNECTION_LOST = "protocol-connection-lost",
    ER_CON_COUNT_ERROR = "er-con-count-error",
    ECONNREFUSED = "econnredused",

    // operation
    INSERT_ERROR = "insert-error",
    UPDATE_ERROR = "update-error",
    DELETE_ERROR = "delete-error",
    SELECT_ERROR = "select-error"
}

export default DatabaseErrorType