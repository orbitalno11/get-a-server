import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../core/logging/Logger"
import { Grade } from "../model/common/data/Grade"
import { Gender } from "../model/common/data/Gender"
import { OfflineCourseEntity } from "../entity/course/offline/offlineCourse.entity"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { CourseError } from "../core/exceptions/constants/course-error.enum"

/**
 * Repository class for search
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class SearchRepository {
    constructor(private readonly connection: Connection) {
    }

    /**
     * Search offline course
     * @param grade
     * @param subject
     * @param gender
     * @param location
     * @param page
     * @param pageSize
     */
    async searchOfflineCourse(grade: Grade, subject: string, gender: Gender, location: string, page: number, pageSize: number): Promise<Array<OfflineCourseEntity>> {
        try {
            const query = await this.connection.createQueryBuilder(OfflineCourseEntity, "course")
                .leftJoinAndSelect("course.owner", "owner")
                .leftJoinAndSelect("course.rating", "rating")
                .leftJoinAndSelect("owner.member", "member")
                .leftJoinAndSelect("member.memberAddress", "address")
                .leftJoinAndSelect("address.province", "province")
                .leftJoinAndSelect("address.district", "district")
                .andWhere("course.grade = :grade", { grade: grade })
                .andWhere("course.subject like :subject", { subject: subject })

            if (gender !== Gender.NOT_SPECIFIC) {
                query.andWhere("member.gender = :gender", { gender: gender })
            }

            if (location) {
                query.andWhere("district.id like :location", { location: location })
            }

            return await query
                .skip(pageSize * (page - 1))
                .limit(pageSize)
                .distinct(true)
                .orderBy("rating.rating", "DESC")
                .getMany()
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get course", CourseError.CAN_NOT_GET_COURSE)
        }
    }
}

export default SearchRepository