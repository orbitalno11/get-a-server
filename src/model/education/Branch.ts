import { ApiProperty } from "@nestjs/swagger"

class Branch {
    @ApiProperty() id: number
    @ApiProperty() title: string

    public static create(id: number, title: string): Branch {
        const branch = new Branch()
        branch.id = id
        branch.title = title
        return branch
    }
}

export default Branch