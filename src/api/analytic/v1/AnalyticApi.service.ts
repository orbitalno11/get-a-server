import { Injectable } from "@nestjs/common"
import AnalyticRepository from "../../../repository/AnalyticRepository"

/**
 * Service class for analytic api
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class AnalyticApiService {
    constructor(private readonly repository: AnalyticRepository) {
    }
}