import { ApiProperty } from "@nestjs/swagger"

class ClipForm {
    @ApiProperty()
    courseId: string
    @ApiProperty()
    name: string
    @ApiProperty()
    description: string
    @ApiProperty()
    cost: number

    public static createFormBody(body: ClipForm): ClipForm {
        const form = new ClipForm()
        form.courseId = body.courseId
        form.name = body.name
        form.description = body.description
        form.cost = Number(body.cost)
        return form
    }
}

export default ClipForm