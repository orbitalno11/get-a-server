import {MiddlewareConsumer, Module, NestModule, RequestMethod} from "@nestjs/common";
import {CoreModule} from "../../../core/core.module";
import {UtilityModule} from "../../../utils/utility.module";
import {MeController} from "./me.controller";
import {MeService} from "./me.service";
import Authenticated from "../../../middleware/auth/Authenticated.middleware";

/**
 * Class for "/v1/me" api module
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule, UtilityModule],
    controllers: [MeController],
    providers: [MeService]
})
export class MeModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(Authenticated)
            .forRoutes(
                {path: "v1/me/address", method: RequestMethod.ALL}
            )
    }
}