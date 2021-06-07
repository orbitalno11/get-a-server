import { ApiProperty } from "@nestjs/swagger"
import PublicProfile from "../profile/PublicProfile"
import Subject from "../common/Subject"
import Grade from "../common/Grade"

class OnlineCourseCard {
    @ApiProperty() id: string
    @ApiProperty() name: string
    @ApiProperty() subject: Subject
    @ApiProperty() grade: Grade
    @ApiProperty() rating: number
    @ApiProperty() coverUrl: string
    @ApiProperty() owner: PublicProfile
    @ApiProperty() numberOfVideo: number
    @ApiProperty() created: Date
    @ApiProperty() updated: Date
}

export default OnlineCourseCard