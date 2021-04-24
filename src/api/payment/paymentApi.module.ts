import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common"
import { CoreModule } from "../../core/core.module"
import { UtilityModule } from "../../utils/utility.module"
import { RepositoryModule } from "../../repository/repository.module"
import { PaymentApiService } from "./paymentApi.service"
import { PaymentApiController } from "./paymentApi.controller"
import { PaymentModule } from "../../payment/payment.module"
import Authenticated from "../../middleware/auth/Authenticated.middleware"

@Module({
    imports: [CoreModule, UtilityModule, PaymentModule, RepositoryModule],
    controllers: [PaymentApiController],
    providers: [PaymentApiService]
})
export class PaymentApiModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(Authenticated)
            .forRoutes(
                { path: "v1/payment/pay/qrcode", method: RequestMethod.POST }
            )
    }
}