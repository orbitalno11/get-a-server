import { ApiProperty } from "@nestjs/swagger"
import PublicProfile from "../profile/PublicProfile"
import OnlineCourseCard from "../course/OnlineCourseCard"

class ClipDetail {
    @ApiProperty() id: string
    @ApiProperty() name: string
    @ApiProperty() description: string
    @ApiProperty() cost: number
    @ApiProperty() clipUrl: string
    @ApiProperty() bought: boolean
    @ApiProperty() owner: PublicProfile
    @ApiProperty() course: OnlineCourseCard
}

export default ClipDetail