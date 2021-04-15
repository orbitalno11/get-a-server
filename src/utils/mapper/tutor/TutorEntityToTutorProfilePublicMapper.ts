import {TutorEntity} from "../../../entity/profile/tutor.entity";
import TutorProfile from "../../../model/profile/TutorProfile";
import {ExamResultEntityToExamResultMapper} from "../common/ExamResultEntityToExamResultMapper";
import Mapper from "../../../core/common/Mapper";
import {EducationEntityToEducationMapper} from "../common/EducationEntityToEducationMapper";

export class TutorEntityToTutorProfilePublicMapper implements Mapper<TutorEntity, TutorProfile> {
    map(from: TutorEntity): TutorProfile {
        const profile = new TutorProfile()
        profile.firstname = from.member.firstname
        profile.lastname = from.member.lastname
        profile.profileUrl = from.member.profileUrl
        profile.gender = from.member.gender
        profile.address = null // todo update member address
        profile.contact = from.contact
        profile.education = new EducationEntityToEducationMapper().toEducationArray(from.educationHistory)
        profile.examResult = new ExamResultEntityToExamResultMapper().toExamResultArray(from.testingHistory)
        profile.rating = 0.0 // todo calculate tutor rating
        profile.studentNumber = 0.0 // todo calculate student number
        return profile
    }

    public static getTutorSimpleDetail(data: TutorEntity): TutorProfile {
        const tutorProfile = new TutorProfile()
        tutorProfile.id = data.member.id
        tutorProfile.firstname = data.member.firstname
        tutorProfile.lastname = data.member.lastname
        tutorProfile.fullName = `${data.member.firstname} ${data.member.lastname}`
        return tutorProfile
    }
}