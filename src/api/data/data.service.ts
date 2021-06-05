import { Injectable } from "@nestjs/common"
import DataRepository from "../../repository/DataRepository"

/**
 * Service class for data controller
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class DataService {
    constructor(private readonly repository: DataRepository) {
    }
}