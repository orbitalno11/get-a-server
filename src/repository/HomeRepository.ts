import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"

@Injectable()
class HomeRepository {
    constructor(private readonly connection: Connection) {
    }
}

export default HomeRepository