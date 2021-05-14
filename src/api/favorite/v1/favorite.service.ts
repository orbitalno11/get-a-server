import { Injectable } from "@nestjs/common"
import FavoriteRepository from "../../../repository/FavoriteRepository"
import AnalyticManager from "../../../analytic/AnalyticManager"

/**
 * Service Class for "v1/favorite"
 * @see FavoriteController
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class FavoriteService {
    constructor(
        private readonly repository: FavoriteRepository,
        private readonly analytic: AnalyticManager
    ) {
    }
}