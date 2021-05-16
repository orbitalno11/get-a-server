import { Module } from "@nestjs/common"
import { CoreModule } from "../core/core.module"
import { RepositoryModule } from "../repository/repository.module"
import TokenManager from "./token/TokenManager"
import UserUtil from "./UserUtil"
import { FileStorageUtils } from "./files/FileStorageUtils"
import { ImageUtils } from "./files/ImageUtils"

@Module({
    imports: [CoreModule, RepositoryModule],
    providers: [TokenManager, UserUtil, FileStorageUtils, ImageUtils],
    exports: [TokenManager, UserUtil, FileStorageUtils]
})
export class UtilityModule {
}
