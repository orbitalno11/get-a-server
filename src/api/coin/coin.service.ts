import {Injectable} from "@nestjs/common";
import {Connection} from "typeorm";

@Injectable()
export class CoinService {
    constructor(private readonly connection: Connection) {
    }

    async createCoinRate() {

    }
}