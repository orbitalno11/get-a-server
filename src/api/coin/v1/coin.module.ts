import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common"
import { CoreModule } from "../../../core/core.module"
import { UtilityModule } from "../../../utils/utility.module"
import { CoinService } from "./coin.service"
import { CoinController } from "./coin.controller"
import { RepositoryModule } from "../../../repository/repository.module"
import { PaymentModule } from "../../../payment/payment.module"
import AdminAuthenticated from "../../../middleware/auth/AdminAuthenticated.middleware"
import AuthenticatedRequest from "../../../middleware/auth/AuthenticatedRequest.middleware"
import TutorAuthenticated from "../../../middleware/auth/TutorAuthenticated.middleware"

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
            .apply(AdminAuthenticated)
            .exclude(
                { path: "v1/coin/rates", method: RequestMethod.GET },
                { path: "v1/coin/rate/:id", method: RequestMethod.GET },
                { path: "v1/coin/redeem", method: RequestMethod.POST },
                { path: "v1/coin/redeem/:id", method: RequestMethod.GET },
                { path: "v1/coin/redeem/:id/cancel", method: RequestMethod.GET }
            )
            .forRoutes(CoinController)
            .apply(TutorAuthenticated)
            .forRoutes(
                { path: "v1/coin/redeem", method: RequestMethod.POST },
                { path: "v1/coin/redeem/:id/cancel", method: RequestMethod.GET }
            )
            .apply(AuthenticatedRequest)
            .forRoutes(
                { path: "v1/coin/rates", method: RequestMethod.GET },
                { path: "v1/coin/redeem/:id", method: RequestMethod.GET }
            )
    }
}