import SimpleProfile from "../profile/SimpleProfile"

class Review {
    id: number
    rating: number
    review: string
    reviewDate: Date
    owner: boolean
    reviewer: SimpleProfile
}

export default Review