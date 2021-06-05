import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"

@Injectable()
class DataRepository {
    constructor(private readonly connection: Connection) {
    }
}

export default DataRepository