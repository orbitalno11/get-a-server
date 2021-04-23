import * as helmet from "helmet"
import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common"
import {ConfigModule} from "@nestjs/config"
import {TypeOrmModule} from "@nestjs/typeorm"
import {Connection} from "typeorm"
import {AppController} from "./app.controller"
import {AppService} from "./app.service"
import LoggerFactory from "./core/logging/LoggerFactory.middleware"
import {ormConfig} from "./configs/ormconfig"
import "./core/extension/string.extension"
import "./core/extension/number.extension"
import {AuthenticationModule} from "./api/authentication/v1/authentication.module"
import {TutorModule} from "./api/tutor/v1/tutor.module"
import {LearnerModule} from "./api/learner/v1/learner.module"
import {OfflineCourseModule} from "./api/offline-course/v1/OfflineCourse.module"
import {MeModule} from "./api/me/v1/me.module"


@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(ormConfig),
        AuthenticationModule,
        TutorModule,
        LearnerModule,
        OfflineCourseModule,
        MeModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule implements NestModule {
    constructor(private connection: Connection) {
    }

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(helmet(), LoggerFactory).forRoutes("*")
    }
}
