class ReviewForm {
    id: string
    rating: number
    comment: string
    isClip: boolean
    isOfflineCourse: boolean

    // static method
    public static createFromBody(body: ReviewForm): ReviewForm {
        const form = new ReviewForm()
        form.id = body.id
        form.rating = Number(body.rating)
        form.comment = body.comment
        form.isClip = body.isClip
        form.isOfflineCourse = body.isOfflineCourse
        return form
    }
}

export default ReviewForm