import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { logger } from "../core/logging/Logger"
import { Grade } from "../model/common/data/Grade"
import { Gender } from "../model/common/data/Gender"
import { OfflineCourseEntity } from "../entity/course/offline/offlineCourse.entity"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import { CourseError } from "../core/exceptions/constants/course-error.enum"
import { OnlineCourseEntity } from "../entity/course/online/OnlineCourse.entity"
import { Subject } from "../model/common/data/Subject"
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate"

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
     * @param paginationOption
     * @param location
     */
    async searchOfflineCourse(grade: Grade, subject: string, gender: Gender, paginationOption: IPaginationOptions, location?: string): Promise<Pagination<OfflineCourseEntity>> {
        try {
            const query = this.connection.createQueryBuilder(OfflineCourseEntity, "course")
                .leftJoinAndSelect("course.owner", "owner")
                .leftJoinAndSelect("course.statistic", "statistic")
                .leftJoinAndSelect("course.subject", "subject")
                .leftJoinAndSelect("course.grade", "grade")
                .leftJoinAndSelect("owner.member", "member")
                .leftJoinAndSelect("member.memberAddress", "address")
                .leftJoinAndSelect("address.province", "province")
                .leftJoinAndSelect("address.district", "district")

            if (grade !== Grade.NOT_SPECIFIC) {
                query.andWhere("course.grade = :grade", { grade: grade })
            }

            if (subject !== Subject.NOT_SPECIFIC) {
                query.andWhere("course.subject like :subject", { subject: subject })
            }

            if (gender !== Gender.NOT_SPECIFIC) {
                query.andWhere("member.gender = :gender", { gender: gender })
            }

            if (location) {
                query.andWhere("district.id like :location", { location: location })
            }

            query.distinct(true)
                .orderBy("statistic.rating", "DESC")

            return paginate<OfflineCourseEntity>(query, paginationOption)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get course", CourseError.CAN_NOT_GET_COURSE)
        }
    }

    /**
     * Search online course
     * @param grade
     * @param subject
     * @param gender
     * @param paginationOption
     */
    async searchOnlineCourse(grade: Grade, subject: string, gender: Gender, paginationOption: IPaginationOptions): Promise<Pagination<OnlineCourseEntity>> {
        try {
            const query = this.connection.createQueryBuilder(OnlineCourseEntity, "course")
                .leftJoinAndSelect("course.owner", "owner")
                .leftJoinAndSelect("course.statistic", "statistic")
                .leftJoinAndSelect("course.grade", "grade")
                .leftJoinAndSelect("course.subject", "subject")
                .leftJoinAndSelect("owner.member", "member")

            if (grade !== Grade.NOT_SPECIFIC) {
                query.andWhere("course.grade = :grade", { grade: grade })
            }

            if (subject !== Subject.NOT_SPECIFIC) {
                query.andWhere("course.subject like :subject", { subject: subject })
            }

            if (gender !== Gender.NOT_SPECIFIC) {
                query.andWhere("member.gender = :gender", { gender: gender })
            }

            query.distinct(true)
                .orderBy("statistic.courseRank", "DESC")
                .orderBy("statistic.rating", "DESC")

            return paginate<OnlineCourseEntity>(query, paginationOption)
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get course", CourseError.CAN_NOT_GET_COURSE)
        }
    }
}

export default SearchRepository