import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import helmet from "helmet"

import { handleResponse } from "./core/response/ResponseHandler"

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
    }

    private initialRoute(): void {

    }

    private initialHandler(): void {
        this.app.use(handleResponse)
    }

    startServer(): void {
        this.app.listen(this.portNumber, () => {
            console.log("[GET-A SERVER] WAS STARTED")
        })
    }
}

export default Server