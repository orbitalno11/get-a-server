import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"

/**
 * Repository for favorite api
 * @see FavoriteController
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class FavoriteRepository {
    constructor(private readonly connection: Connection) {
    }
}

export default FavoriteRepository