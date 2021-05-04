import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import {
    getDatabaseHost,
    getDatabaseName,
    getDatabasePassword,
    getDatabaseUser
} from "./EnvironmentConfig"
import { TutorEntity } from "../entity/profile/tutor.entity"
import { MemberEntity } from "../entity/member/member.entitiy"
import { GradeEntity } from "../entity/common/grade.entity"
import { SubjectEntity } from "../entity/common/subject.entity"
import { InterestedSubjectEntity } from "../entity/member/interestedSubject.entity"
import { ContactEntity } from "../entity/contact/contact.entitiy"
import { RoleEntity } from "../entity/common/role.entity"
import { MemberRoleEntity } from "../entity/member/memberRole.entitiy"
import { ZoneEntity } from "../entity/contact/zone.entity"
import { ProvinceEntity } from "../entity/contact/province.entity"
import { DistrictEntity } from "../entity/contact/district.entity"
import { SubDistrictEntity } from "../entity/contact/subDistrict.entity"
import { MemberAddressEntity } from "../entity/member/memberAddress.entity"
import { InstituteEntity } from "../entity/education/institute.entity"
import { BranchEntity } from "../entity/education/branch.entity"
import { LearnerEntity } from "../entity/profile/learner.entity"
import { FavoriteTutorEntity } from "../entity/favoriteTutor.entity"
import { ExamTypeEntity } from "../entity/education/examType.entity"
import { TestingHistoryEntity } from "../entity/education/testingHistory.entity"
import { EducationHistoryEntity } from "../entity/education/educationHistory.entity"
import { ExchangeRateEntity } from "../entity/coins/exchangeRate.entity"
import { CoinEntity } from "../entity/coins/coin.entity"
import { ExchangeTransactionEntity } from "../entity/coins/exchangeTransaction.entity"
import { CourseTypeEntity } from "../entity/course/courseType.entity"
import { OfflineCourseEntity } from "../entity/course/offline/offlineCourse.entity"
import { OfflineCourseRatingEntity } from "../entity/course/offline/offlineCourseRating.entity"
import { OfflineCourseRatingTransactionEntity } from "../entity/course/offline/offlineCourseRatingTransaction.entity"
import { OfflineCourseLeanerRequestEntity } from "../entity/course/offline/offlineCourseLearnerRequest.entity"
import { PaymentTransactionEntity } from "../entity/payment/PaymentTransaction.entity"
import { CoinTransactionEntity } from "../entity/coins/CoinTransaction.entity"

const ormConfig: TypeOrmModuleOptions = {
    type: "mysql",
    host: getDatabaseHost(),
    port: 3306,
    username: getDatabaseUser(),
    password: getDatabasePassword(),
    database: getDatabaseName(),
    synchronize: false,
    entities: [
        MemberEntity,
        GradeEntity,
        SubjectEntity,
        InterestedSubjectEntity,
        ContactEntity,
        RoleEntity,
        MemberRoleEntity,
        ZoneEntity,
        ProvinceEntity,
        DistrictEntity,
        SubDistrictEntity,
        MemberAddressEntity,
        InstituteEntity,
        BranchEntity,
        TutorEntity,
        LearnerEntity,
        FavoriteTutorEntity,
        ExamTypeEntity,
        TestingHistoryEntity,
        EducationHistoryEntity,
        ExchangeRateEntity,
        CoinEntity,
        PaymentTransactionEntity,
        CoinTransactionEntity,
        ExchangeTransactionEntity,
        CourseTypeEntity,
        OfflineCourseEntity,
        OfflineCourseRatingEntity,
        OfflineCourseRatingTransactionEntity,
        OfflineCourseLeanerRequestEntity
    ]
}

export { ormConfig }
