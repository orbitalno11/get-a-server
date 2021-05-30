import * as dotenv from "dotenv"
const env = process.env.NODE_ENV ? `../.env.${process.env.NODE_ENV}` : ".env"
dotenv.config({ path: env })

import { HttpAdapterHost, NestFactory } from "@nestjs/core"
import * as cookieParser from "cookie-parser"
import * as helmet from "helmet"
import { SERVER_PORT } from "./configs/EnvironmentConfig"
import { AppModule } from "./app.module"
import { UnexpectedExceptionFilter } from "./core/exceptions/filters/UnexpectedException.filter"
import { logger } from "./core/logging/Logger"
import { ErrorExceptionFilter } from "./core/exceptions/filters/ErrorException.filter"
import { FailureResponseExceptionFilter } from "./core/exceptions/filters/FailureResponseException.filter"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const { httpAdapter } = app.get(HttpAdapterHost)

    app.enableCors({
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
    app.use(helmet(), cookieParser())
    app.useGlobalFilters(new UnexpectedExceptionFilter(httpAdapter), new ErrorExceptionFilter(), new FailureResponseExceptionFilter())

    const config = new DocumentBuilder()
        .setTitle("GET-A")
        .setDescription("GET-A: Web Application for Finding Tutor")
        .setVersion("1.0")
        .addBearerAuth()
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup("/", app, document)

    const portNumber = SERVER_PORT
    await app.listen(portNumber)
    logger.info(`[GET-A SERVER] WAS STARTED AT ${portNumber}`)
}

bootstrap()
