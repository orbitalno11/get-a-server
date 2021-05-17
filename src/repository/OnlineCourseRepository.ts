import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"

@Injectable()
class OnlineCourseRepository {
    constructor(private readonly connection: Connection) {
    }
}

export default OnlineCourseRepository