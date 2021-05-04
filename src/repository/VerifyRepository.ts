import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"

/**
 * Repository for "v1/verify"
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class VerifyRepository {
    constructor(private readonly connection: Connection) {
    }
}

export default VerifyRepository