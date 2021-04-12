import { Module } from "@nestjs/common"
import { CoreModule } from "../../core/core.module"
import { UtilityModule } from "../../utils/utility.module"
import { RepositoryModule } from "../../repository/repository.module"
import { PaymentApiService } from "./paymentApi.service"
import { PaymentApiController } from "./paymentApi.controller"
import { PaymentModule } from "../../payment/payment.module"

@Module({
    imports: [CoreModule, UtilityModule, PaymentModule, RepositoryModule],
    controllers: [PaymentApiController],
    providers: [PaymentApiService],
})
export class PaymentApiModule {
}