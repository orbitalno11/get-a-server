class ClipForm {
    courseId: string
    name: string
    description: string
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