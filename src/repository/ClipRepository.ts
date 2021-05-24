import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"

/**
 * Repository class for clip
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class ClipRepository {
    constructor(private readonly connection: Connection) {
    }
}

export default ClipRepository