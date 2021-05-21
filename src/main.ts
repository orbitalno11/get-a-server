import * as dotenv from "dotenv"
const env = process.env.NODE_ENV ? `../.env.${process.env.NODE_ENV}` : ".env.prod"
dotenv.config({ path: env })

import { HttpAdapterHost, NestFactory } from "@nestjs/core"
import { SERVER_PORT } from "./configs/EnvironmentConfig"
import * as helmet from "helmet"
import { AppModule } from "./app.module"
import { UnexpectedExceptionFilter } from "./core/exceptions/filters/UnexpectedException.filter"
import { logger } from "./core/logging/Logger"
import { ErrorExceptionFilter } from "./core/exceptions/filters/ErrorException.filter"
import { FailureResponseExceptionFilter } from "./core/exceptions/filters/FailureResponseException.filter"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const { httpAdapter } = app.get(HttpAdapterHost)

    app.enableCors({
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
    app.use(helmet())
    app.useGlobalFilters(new UnexpectedExceptionFilter(httpAdapter), new ErrorExceptionFilter(), new FailureResponseExceptionFilter())

    const portNumber = SERVER_PORT
    await app.listen(portNumber)
    logger.info(`[GET-A SERVER] WAS STARTED AT ${portNumber}`)
}

bootstrap()
