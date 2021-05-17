import { Injectable } from "@nestjs/common"
import OnlineCourseRepository from "../../../repository/OnlineCourseRepository"

@Injectable()
export class OnlineCourseService {
    constructor(private readonly repository: OnlineCourseRepository) {
    }
}