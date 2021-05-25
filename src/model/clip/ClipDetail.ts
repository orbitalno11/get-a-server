import { ApiProperty } from "@nestjs/swagger"

class ClipDetail {
    @ApiProperty()
    id: string
    @ApiProperty()
    name: string
    @ApiProperty()
    description: string
    @ApiProperty()
    clipUrl: string
}

export default ClipDetail