import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Connection } from "typeorm"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import LoggerFactory from "./core/logging/LoggerFactory.middleware"
import { ormConfig } from "./configs/ormconfig"
import "./core/extension/string.extension"
import "./core/extension/number.extension"
import { AuthenticationModule } from "./api/authentication/v1/authentication.module"
import { TutorModule } from "./api/tutor/v1/tutor.module"
import { LearnerModule } from "./api/learner/v1/learner.module"
import { OfflineCourseModule } from "./api/offline-course/v1/OfflineCourse.module"
import { MeModule } from "./api/me/v1/me.module"
import { CoinModule } from "./api/coin/coin.module"
import { PaymentApiModule } from "./api/payment/paymentApi.module"
import { VerifyModule } from "./api/verify/v1/verify.module"
import { ReviewModule } from "./api/review/v1/review.module"

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env.${process.env.NODE_ENV}`
        }),
        TypeOrmModule.forRoot(ormConfig),
        AuthenticationModule,
        TutorModule,
        LearnerModule,
        OfflineCourseModule,
        MeModule,
        CoinModule,
        PaymentApiModule,
        VerifyModule,
        ReviewModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule implements NestModule {
    constructor(private connection: Connection) {
    }

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerFactory).forRoutes("*")
    }
}
