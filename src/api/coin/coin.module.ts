import {Module} from "@nestjs/common";
import {CoreModule} from "../../core/core.module";
import {UtilityModule} from "../../utils/utility.module";
import {CoinService} from "./coin.service";
import {CoinController} from "./coin.controller";

/**
 * Class for "v1/coin" module
 * @author orbitalno11 2021 A.D.
 */
@Module({
    imports: [CoreModule, UtilityModule],
    providers: [CoinService],
    controllers: [CoinController]
})
export class CoinModule {

}