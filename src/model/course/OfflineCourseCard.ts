import Address from "../location/Address"
import PublicProfile from "../profile/PublicProfile"
import { ApiProperty } from "@nestjs/swagger"
import Subject from "../common/Subject"
import Grade from "../common/Grade"

class OfflineCourseCard {
    @ApiProperty() id: string
    @ApiProperty() name: string
    @ApiProperty() subject: Subject
    @ApiProperty() grade: Grade
    @ApiProperty() dayOfWeek: number
    @ApiProperty() startTime: string
    @ApiProperty() endTime: string
    @ApiProperty() timeText: string
    @ApiProperty() rating: number
    @ApiProperty() cost: number
    @ApiProperty() costText: string
    @ApiProperty() status: string
    @ApiProperty() numberOfStudent: number
    @ApiProperty() location: Address
    @ApiProperty() owner: PublicProfile
}

export default OfflineCourseCard