import { Injectable } from "@nestjs/common"
import HomeRepository from "../../../repository/HomeRepository"

@Injectable()
export class HomeService {
    constructor(private readonly repository: HomeRepository) {
    }
}
