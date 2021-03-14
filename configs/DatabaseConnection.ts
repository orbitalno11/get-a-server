import util from "util"
import mysql from "mysql"
class DatabaseConnection {
    private conn

    constructor() {
        this.conn = mysql.createConnection({
            host: process.env.db_host,
            user: process.env.db_user,
            password: process.env.db_password,
            database: process.env.db_name
        })
    }

    connect() {
        return util.promisify(this.conn.connect).call(this.conn)
    }

    query(sqlCommand: string, args?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.conn.query(sqlCommand, args, (err, result, fields) => {
                if (!err) resolve(result)
                else reject(err)
            })
        })
    }

    beginTransaction() {
        return util.promisify(this.conn.beginTransaction).call(this.conn)
    }

    commit() {
        return util.promisify(this.conn.commit).call(this.conn)
    }

    rollback() {
        return util.promisify(this.conn.rollback).call(this.conn)
    }

    close() {
        return util.promisify(this.conn.end).call(this.conn)
    }
}

export default DatabaseConnection