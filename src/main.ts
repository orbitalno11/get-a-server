import {HttpAdapterHost, NestFactory} from "@nestjs/core"
import {AppModule} from "./app.module"
import {getPortNumber} from "./configs/EnvironmentConfig"
import {UnexpectedExceptionFilter} from "./core/exceptions/filters/UnexpectedException.filter"
import {logger} from "./core/logging/Logger"
import {ErrorExceptionFilter} from "./core/exceptions/filters/ErrorException.filter"
import {FailureResponseExceptionFilter} from "./core/exceptions/filters/FailureResponseException.filter"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const {httpAdapter} = app.get(HttpAdapterHost)

    app.enableCors()
    app.useGlobalFilters(new UnexpectedExceptionFilter(httpAdapter), new ErrorExceptionFilter(), new FailureResponseExceptionFilter())

    const portNumber = getPortNumber()
    await app.listen(portNumber)
    logger.info(`[GET-A SERVER] WAS STARTED AT ${portNumber}`)
}

bootstrap()
