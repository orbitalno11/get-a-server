import { Module } from "@nestjs/common"
import PaymentManager from "./PaymentManager"

/**
 * Module for manage payment
 * @author orbitalno11 2021 A.D.
 */
@Module({
    providers: [PaymentManager],
    exports: [PaymentManager]
})
export class PaymentModule {
}