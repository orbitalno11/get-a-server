import { ApiProperty } from "@nestjs/swagger"

class District {
    @ApiProperty() id: string
    @ApiProperty() title: string
}

export default District