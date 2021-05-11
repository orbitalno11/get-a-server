import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common"
import { CoreModule } from "../../../core/core.module"
import { UtilityModule } from "../../../utils/utility.module"
import { CoinService } from "./coin.service"
import { CoinController } from "./coin.controller"
import { RepositoryModule } from "../../../repository/repository.module"
import { PaymentModule } from "../../../payment/payment.module"
import Authenticated from "../../../middleware/auth/Authenticated.middleware"

/**
 * Class for "v1/coin" module
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule, UtilityModule, RepositoryModule, PaymentModule],
    providers: [CoinService],
    controllers: [CoinController]
})
export class CoinModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(Authenticated)
            .exclude(
                { path: "v1/coin/rates", method: RequestMethod.GET }
            )
            .forRoutes(CoinController)
    }
}