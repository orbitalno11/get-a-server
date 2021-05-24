import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { OnlineCourseEntity } from "../entity/course/online/OnlineCourse.entity"
import ClipForm from "../model/clip/ClipForm"

/**
 * Repository class for clip
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class ClipRepository {
    constructor(private readonly connection: Connection) {
    }

    async createClip(course: OnlineCourseEntity, data: ClipForm, clipUrl: string)
}

export default ClipRepository