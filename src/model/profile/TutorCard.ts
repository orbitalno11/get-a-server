import Address from "../location/Address"
import Subject from "../common/Subject"
import { ApiProperty } from "@nestjs/swagger"

class TutorCard {
    @ApiProperty() id: string
    @ApiProperty() fullNameText: string
    @ApiProperty() pictureUrl: string
    @ApiProperty() address: Address
    @ApiProperty() subject: Subject
    @ApiProperty() rating: number
}

export default TutorCard