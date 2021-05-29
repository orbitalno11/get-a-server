import { ApiProperty } from "@nestjs/swagger"

class Province {
    @ApiProperty() id: string
    @ApiProperty() title: string
}

export default Province