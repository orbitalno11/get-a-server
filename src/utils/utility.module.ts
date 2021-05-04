import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CoreModule } from "../core/core.module"
import { MemberEntity } from "../entity/member/member.entitiy"
import { MemberRoleEntity } from "../entity/member/memberRole.entitiy"
import { RoleEntity } from "../entity/common/role.entity"
import TokenManager from "./token/TokenManager"
import UserManager from "./UserManager"
import { TutorEntity } from "../entity/profile/tutor.entity"
import { LearnerEntity } from "../entity/profile/learner.entity"
import { FileStorageUtils } from "./files/FileStorageUtils"
import { ImageUtils } from "./files/ImageUtils"

@Module({
    imports: [
        TypeOrmModule.forFeature([MemberEntity, MemberRoleEntity, RoleEntity, TutorEntity, LearnerEntity]),
        CoreModule
    ],
    providers: [TokenManager, UserManager, FileStorageUtils, ImageUtils],
    exports: [TokenManager, UserManager, FileStorageUtils]
})
export class UtilityModule {
}
