import { ApiProperty } from "@nestjs/swagger"

class Bank {
    @ApiProperty() id: string
    @ApiProperty() title: string
}

export default Bank