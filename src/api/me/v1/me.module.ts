import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {CoreModule} from "../../../core/core.module";
import {UtilityModule} from "../../../utils/utility.module";
import {MeController} from "./me.controller";
import {MeService} from "./me.service";
import Authenticated from "../../../middleware/auth/Authenticated.middleware";
import {RepositoryModule} from "../../../repository/repository.module"

/**
 * Class for "/v1/me" api module
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule, UtilityModule, RepositoryModule],
    controllers: [MeController],
    providers: [MeService]
})
export class MeModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(Authenticated)
            .forRoutes("v1/me", "v1/me/(.*)")
    }
}