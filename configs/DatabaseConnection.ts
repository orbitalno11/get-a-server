import mysql from "mysql"

class DatabaseConnection {
    private connection

    constructor() {
        this.connection = mysql.createConnection({
            host: process.env.db_host,
            user: process.env.db_user,
            password: process.env.password,
            database: process.env.db_name
        })
        this.connect()
    }

    connect() {
        this.connection.connect()
    }

    getConnection(): mysql.Connection {
        return this.connection
    }

    close() {
        this.connection.destroy()
    }
}

export default DatabaseConnection