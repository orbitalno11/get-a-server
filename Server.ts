import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import helmet from "helmet"

import { handleResponse } from "./core/response/ResponseHandler"
import { logger, httpLog } from "./utils/log/logger"

class Server {
    private app
    private portNumber

    constructor() {
        this.app = express()
        this.portNumber = this.getPortNumber()
        this.initialServer()
        this.initialRoute()
        this.initialHandler()
    }

    private getPortNumber(): string|undefined {
        if (process.env.environment === "prod") {
            return process.env.prod_port
        } else {
            return process.env.dev_port
        }
    }

    private initialServer(): void {
        this.app.use(cors())
        this.app.use(helmet())
        this.app.use(bodyParser.json())
        this.app.use(
            bodyParser.urlencoded({
                extended: true
            })
        )
        this.app.use(httpLog)
    }

    private initialRoute(): void {

    }

    private initialHandler(): void {
        this.app.use(handleResponse)
    }

    startServer(): void {
        this.app.listen(this.portNumber, () => {
            logger.info(`[GET-A SERVER] WAS STARTED AT ${this.portNumber}`)
        })
    }
}

export default Server