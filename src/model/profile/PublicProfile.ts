import Address from "../location/Address"
import { Gender } from "../common/data/Gender"
import Subject from "../common/Subject"
import Contact from "../Contact"
import { ApiProperty } from "@nestjs/swagger"

class PublicProfile {
    @ApiProperty() id: string
    @ApiProperty() firstname: string
    @ApiProperty() lastname: string
    @ApiProperty() fullNameText: string
    @ApiProperty() gender: Gender
    @ApiProperty() picture: string
    @ApiProperty() introduction: string
    @ApiProperty() address: Address
    @ApiProperty() contact: Contact
    @ApiProperty() numberOfLearner: number
    @ApiProperty() rating: number
    @ApiProperty() interestedSubject: Subject[]
}

export default PublicProfile