import { ApiProperty } from "@nestjs/swagger"

class Institute {
    @ApiProperty() id: number
    @ApiProperty() name: string

    public static create(id: number, name: string): Institute {
        const institute = new Institute()
        institute.id = id
        institute.name = name
        return institute
    }
}

export default Institute