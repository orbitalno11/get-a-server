import { createLogger, transports, format } from "winston"
import morgan from "morgan"

const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss:ms ' }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.File({
            filename: './logs/all-logs.log',
            maxFiles: 5,
            maxsize: 5242880
        }),
        new transports.Console()
    ]
})

class LoggerStream {
    write(message: string) {
        logger.info(message.substring(0, message.lastIndexOf('\n')))
    }
}

const httpLog = morgan(
    ':status :method :url response-in :response-time ms - (:res[content-length])',
    { stream: new LoggerStream() }
)

export { logger, httpLog }