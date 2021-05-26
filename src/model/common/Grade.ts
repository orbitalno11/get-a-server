import { ApiProperty } from "@nestjs/swagger"

class Grade {
    @ApiProperty() grade: number
    @ApiProperty() title: string

    constructor(grade: number, title: string) {
        this.grade = grade
        this.title = title
    }
}

export default Grade