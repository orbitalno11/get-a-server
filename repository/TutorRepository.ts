import DatabaseConnection from "../configs/DatabaseConnection"
import Member from "../models/member/Member"
import { logger } from "../utils/log/logger"

class TutorRepository {
    private connection: DatabaseConnection

    constructor(conn: DatabaseConnection) {
        this.connection = conn
    }

    async insertTutor(data: Member) {
        try {

        } catch (err) {
            logger.error(err)
        }
    }

}

export default TutorRepository