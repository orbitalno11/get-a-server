import SimpleProfile from "../profile/SimpleProfile"
import { ApiProperty } from "@nestjs/swagger"

class Review {
    @ApiProperty() id: number
    @ApiProperty() rating: number
    @ApiProperty() review: string
    @ApiProperty() reviewDate: Date
    @ApiProperty() owner: boolean
    @ApiProperty() reviewer: SimpleProfile
}

export default Review