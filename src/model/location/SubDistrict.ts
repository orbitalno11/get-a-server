import { ApiProperty } from "@nestjs/swagger"

class SubDistrict {
    @ApiProperty() id: string
    @ApiProperty() title: string
}

export default SubDistrict