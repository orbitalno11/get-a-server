import Mapper from "../../../core/common/Mapper"
import { MemberEntity } from "../../../entity/member/member.entitiy"
import PublicProfile from "../../../model/profile/PublicProfile"

export class MemberEntityToPublicProfileMapper implements Mapper<MemberEntity, PublicProfile> {
    map(from: MemberEntity): PublicProfile {
        const profile = new PublicProfile()
        profile.id = from.id
        profile.firstname = from.firstname
        profile.lastname = from.lastname
        profile.fullNameText = `${profile.firstname} ${profile.lastname}`
        profile.gender = from.gender
        profile.picture = from.profileUrl
        return profile
    }
}