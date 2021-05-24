import { TutorEntity } from "../../../entity/profile/tutor.entity"
import Mapper from "../../../core/common/Mapper"
import PublicProfile from "../../../model/profile/PublicProfile"
import Subject from "../../../model/common/Subject"
import Contact from "../../../model/Contact"
import Address from "../../../model/location/Address"

export class TutorEntityToPublicProfileMapper implements Mapper<TutorEntity, PublicProfile> {
    map(from: TutorEntity): PublicProfile {
        const profile = new PublicProfile()
        profile.id = from.member?.id
        profile.firstname = from.member?.firstname
        profile.lastname = from.member?.lastname
        profile.fullNameText = `${profile.firstname} ${profile.lastname}`
        profile.gender = from.member?.gender
        profile.gender = from.member?.gender
        profile.picture = from.member?.profileUrl
        profile.introduction = from.introduction
        profile.address = new Address().getConvenienceAddress(from.member?.memberAddress)
        profile.contact = Contact.createFromContactEntity(from?.contact)
        profile.numberOfLearner = from.statistic?.numberOfLearner
        profile.rating = from.statistic?.rating
        profile.interestedSubject = from.member?.interestedSubject?.map(
            (item) => Subject.create(item?.subject?.code, item?.subject?.title)
        )
        return profile
    }

    public static getTutorNameCard(data: TutorEntity): PublicProfile {
        const tutorProfile = new PublicProfile()
        tutorProfile.id = data.member?.id
        tutorProfile.firstname = data.member?.firstname
        tutorProfile.lastname = data.member?.lastname
        tutorProfile.picture = data.member?.profileUrl
        tutorProfile.fullNameText = `${data.member?.firstname} ${data.member?.lastname}`
        return tutorProfile
    }

    public static getTutorSimpleDetail(data: TutorEntity): PublicProfile {
        const tutorProfile = this.getTutorNameCard(data)
        tutorProfile.contact = Contact.createFromContactEntity(data?.contact)
        return tutorProfile
    }
}