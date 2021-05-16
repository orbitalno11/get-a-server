class TestingVerifyForm {
    examId: number
    subjectCode: string
    score: number
    year: number

    // static method
    public static createFormBody(body: TestingVerifyForm): TestingVerifyForm {
        const form = new TestingVerifyForm()
        form.examId = Number(body.examId)
        form.score = Number(body.score)
        form.subjectCode = body.subjectCode
        form.year = Number(body.year)
        return form
    }
}

export default TestingVerifyForm