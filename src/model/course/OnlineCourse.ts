import PublicProfile from "../profile/PublicProfile"
import Subject from "../common/Subject"
import Grade from "../common/Grade"
import { ApiProperty } from "@nestjs/swagger"

class OnlineCourse {
    @ApiProperty() id: string
    @ApiProperty() name: string
    @ApiProperty() coverUrl: string
    @ApiProperty() subject: Subject
    @ApiProperty() grade: Grade
    @ApiProperty() owner: PublicProfile
    @ApiProperty() rating: number
    @ApiProperty() numberOfView: number
    @ApiProperty() numberOfVideo: number
}

export default OnlineCourse