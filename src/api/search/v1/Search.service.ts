import { Injectable } from "@nestjs/common"
import SearchRepository from "../../../repository/SearchRepository"

/**
 * Service class for search controller
 * @see SearchController
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class SearchService {
    constructor(private readonly repository: SearchRepository) {
    }
}