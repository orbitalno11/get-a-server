import { ApiProperty } from "@nestjs/swagger"

class Exam {
    @ApiProperty() id: number
    @ApiProperty() title: string

    public static create(id: number, title: string): Exam {
        const exam = new Exam()
        exam.id = id
        exam.title = title
        return exam
    }
}

export default Exam