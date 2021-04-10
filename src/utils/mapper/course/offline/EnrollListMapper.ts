import Mapper from "../../../../core/common/Mapper";
import {OfflineCourseLeanerRequestEntity} from "../../../../entity/course/offline/offlineCourseLearnerRequest.entity";
import OfflineCourseEnroll from "../../../../model/course/OfflineCourseEnroll";

/**
 * @author oribtalno11 2021 A.D.
 */
export class EnrollListMapper implements Mapper<OfflineCourseLeanerRequestEntity[], OfflineCourseEnroll[]> {
    map(from: OfflineCourseLeanerRequestEntity[]): OfflineCourseEnroll[] {
        return from.map((data) => this.requestToEnroll(data))
    }

    private requestToEnroll(data: OfflineCourseLeanerRequestEntity): OfflineCourseEnroll {
        const enrollData = new OfflineCourseEnroll()
        enrollData.firstname = data.learner.member.firstname
        enrollData.lastname = data.learner.member.lastname
        enrollData.fullNameText = `${enrollData.firstname} ${enrollData.lastname}`
        enrollData.photoUrl = data.learner.member.profileUrl
        enrollData.address = null // todo update member address
        enrollData.status = data.status
        return enrollData
    }

}