import { ApiProperty } from "@nestjs/swagger"
import PublicProfile from "../profile/PublicProfile"

class OnlineCourseCard {
    @ApiProperty() id: string
    @ApiProperty() name: string
    @ApiProperty() rating: number
    @ApiProperty() coverUrl: string
    @ApiProperty() owner: PublicProfile
    @ApiProperty() numberOfVideo: number
}

export default OnlineCourseCard