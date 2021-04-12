import {Injectable} from "@nestjs/common"
import {Connection} from "typeorm"
import {logger} from "../core/logging/Logger"
import {ExchangeRateEntity} from "../entity/coins/exchangeRate.entity"
import {CoinRateType} from "../model/coin/data/CoinRateType"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import ErrorType from "../core/exceptions/model/ErrorType"
import {UserRoleKey} from "../core/constant/UserRole"

/**
 * Repository for "v1/coin"
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
class CoinRepository {
    constructor(private readonly connection: Connection) {
    }

    /**
     * Get coin rate depend on user role
     * @param userRole
     */
    async getCoinRateList(userRole: UserRoleKey): Promise<ExchangeRateEntity[]> {
        try {
            switch (userRole) {
                case UserRoleKey.ADMIN: {
                    return await this.connection.createQueryBuilder(ExchangeRateEntity, "exchangeRate").getMany()
                }
                case UserRoleKey.TUTOR: {
                    return await this.connection.createQueryBuilder(ExchangeRateEntity, "exchangeRate")
                        .where("exchangeRate.endDate >= CURDATE()")
                        .getMany()
                }
                case UserRoleKey.LEARNER: {
                    return await this.connection.createQueryBuilder(ExchangeRateEntity, "exchangeRate")
                        .where("exchangeRate.type not like :type", {type: CoinRateType.TRANSFER})
                        .andWhere("exchangeRate.endDate >= CURDATE()")
                        .getMany()
                }
                default: {
                    return await this.connection.createQueryBuilder(ExchangeRateEntity, "exchangeRate")
                        .where("exchangeRate.type not like :type", {type: CoinRateType.TRANSFER})
                        .andWhere("exchangeRate.endDate >= CURDATE()")
                        .getMany()
                }
            }
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not get exchange rate", ErrorType.UNEXPECTED_ERROR)
        }
    }
}

export default CoinRepository