import { ApiProperty } from "@nestjs/swagger"

class GeoLocation {
    @ApiProperty() latitude: number
    @ApiProperty() longitude: number
}

export default GeoLocation