import {Module} from "@nestjs/common";
import {CoreModule} from "../../core/core.module";
import {UtilityModule} from "../../utils/utility.module";
import {CoinService} from "./coin.service";
import {CoinController} from "./coin.controller";

@Module({
    imports: [CoreModule, UtilityModule],
    providers: [CoinService],
    controllers: [CoinController]
})
export class CoinModule {

}