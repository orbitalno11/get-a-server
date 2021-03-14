import DatabaseConnection from "../configs/DatabaseConnection"
import Database from "../core/constant/Database"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import DatabaseErrorType from "../core/exceptions/model/DatabaseErrorType"
import OfflineCourse from "../models/course/OfflineCourse"
import OfflineCourseToArrayMapper from "../utils/mapper/query/OfflineCourseToArrayMapper"
import Repository from "./Repository"

class OfflineCourseRepository extends Repository {

    constructor(conn: DatabaseConnection) {
        super(conn)
    }

    insertCourse(data: OfflineCourse) {
        return this.launch<void>(async () => {
            const insertCourseCommand = `INSERT INTO ${Database.COURSE_TABLE} (course_id, owner_id, course_type_id, subject_id, 
                grade_id, course_name, course_description, course_cost, course_day, start_time, end_time, course_status, request_number) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            await this.connection.beginTransaction()
            await this.connection.query(insertCourseCommand, OfflineCourseToArrayMapper(data))
            await this.connection.commit()
        }, new ErrorExceptions("Can not create course", DatabaseErrorType.INSERT_ERROR))
    }
}

export default OfflineCourseRepository