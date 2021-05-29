import SimpleProfile from "../profile/SimpleProfile"
import { ApiProperty } from "@nestjs/swagger"
import ClipDetail from "../clip/ClipDetail"

class Review {
    @ApiProperty() id: number
    @ApiProperty() rating: number
    @ApiProperty() review: string
    @ApiProperty() reviewDate: Date
    @ApiProperty() owner: boolean
    @ApiProperty() reviewer: SimpleProfile
    @ApiProperty() clip: ClipDetail
}

export default Review