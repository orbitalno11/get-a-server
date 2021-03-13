import DatabaseConnection from "../configs/DatabaseConnection"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { logger } from "../utils/log/logger"

abstract class Repository {
    connection: DatabaseConnection

    constructor(conn: DatabaseConnection) {
        this.connection = conn
    }

    async launch<T>(fx: () => Promise<T>, errorException: ErrorExceptions<any>): Promise<T> {
        return Promise.resolve(fx()).catch(async (error) => {
            logger.error(error)
            await this.connection.rollback()
            throw errorException
        })
    }
}

export default Repository