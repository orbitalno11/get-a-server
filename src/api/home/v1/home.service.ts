import { Injectable } from "@nestjs/common"
import HomeRepository from "../../../repository/HomeRepository"
import TutorCard from "../../../model/profile/TutorCard"
import { launch } from "../../../core/common/launch"
import { isNotEmpty } from "../../../core/extension/CommonExtension"
import { TutorStatisticEntityToTutorCardListMapper } from "../../../utils/mapper/tutor/TutorStatisticEntityToTutorCard.mapper"
import { OnlineCourseToCourseCardMapper } from "../../../utils/mapper/course/online/OnlineCourseToCourseCard.mapper"

/**
 * Service class for "v1/home"
 * @see HomeController
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class HomeService {
    constructor(private readonly repository: HomeRepository) {
    }

    /**
     * Get tutor list by rank
     * @param rankLimit
     */
    getTutorListByRank(rankLimit: number): Promise<TutorCard[]> {
        return launch(async () => {
            const tutorList = await this.repository.getTutorByRank(rankLimit)
            return isNotEmpty(tutorList) ? new TutorStatisticEntityToTutorCardListMapper().map(tutorList) : []
        })
    }

    /**
     * Get online course by rank
     * @param rankLimit
     */
    getOnlineCourseListByRank(rankLimit: number) {
        return launch(async () => {
            const courseList = await this.repository.getOnlineCourse(rankLimit)
            return isNotEmpty(courseList) ? new OnlineCourseToCourseCardMapper().mapList(courseList) : []
        })
    }
}
