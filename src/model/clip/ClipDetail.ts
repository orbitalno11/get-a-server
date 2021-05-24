import { ApiProperty } from "@nestjs/swagger"

class ClipDetail {
    @ApiProperty() id: string
    @ApiProperty() name: string
    @ApiProperty() description: string
    @ApiProperty() cost: number
    @ApiProperty() clipUrl: string
    @ApiProperty() bought: boolean
}

export default ClipDetail