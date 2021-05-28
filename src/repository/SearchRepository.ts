import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"

/**
 * Repository class for search
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class SearchRepository {
    constructor(private readonly connection: Connection) {
    }
}

export default SearchRepository