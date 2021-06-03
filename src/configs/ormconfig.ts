import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import {
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_USER,
    DATABASE_PASSWORD, DATABASE_PORT
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
import { RedeemTransactionEntity } from "../entity/coins/RedeemTransaction.entity"
import { CourseTypeEntity } from "../entity/course/courseType.entity"
import { OfflineCourseEntity } from "../entity/course/offline/offlineCourse.entity"
import { OfflineCourseRatingTransactionEntity } from "../entity/course/offline/offlineCourseRatingTransaction.entity"
import { OfflineCourseLeanerRequestEntity } from "../entity/course/offline/offlineCourseLearnerRequest.entity"
import { PaymentTransactionEntity } from "../entity/payment/PaymentTransaction.entity"
import { CoinTransactionEntity } from "../entity/coins/CoinTransaction.entity"
import { UserVerifyEntity } from "../entity/UserVerify.entity"
import { TutorStatisticEntity } from "../entity/analytic/TutorStatistic.entity"
import { TutorAnalyticRecencyEntity } from "../entity/analytic/TutorAnalyticRecency.entity"
import { TutorAnalyticFrequencyEntity } from "../entity/analytic/TutorAnalyticFrequency.entity"
import { TutorAnalyticMonetaryEntity } from "../entity/analytic/TutorAnalyticMonetary.entity"
import { OnlineCourseEntity } from "../entity/course/online/OnlineCourse.entity"
import { ClipEntity } from "../entity/course/clip/Clip.entity"
import { ClipRatingEntity } from "../entity/course/clip/ClipRating.entity"
import { ClipRatingTransactionEntity } from "../entity/course/clip/ClipRatingTransaction.entity"
import { ClipTransactionEntity } from "../entity/course/clip/ClipTransaction.entity"
import { BankEntity } from "../entity/common/Bank.entity"
import { OfflineCourseStatisticEntity } from "../entity/course/offline/OfflineCourseStatistic.entity"
import { OnlineCourseStatisticEntity } from "../entity/course/online/OnlineCourseStatistic.entity"
import { ClipStatisticEntity } from "../entity/course/clip/ClipStatistic.entity"

const ormConfig: TypeOrmModuleOptions = {
    type: "mysql",
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
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
        RedeemTransactionEntity,
        CourseTypeEntity,
        OfflineCourseEntity,
        OfflineCourseRatingTransactionEntity,
        OfflineCourseLeanerRequestEntity,
        UserVerifyEntity,
        TutorStatisticEntity,
        TutorAnalyticRecencyEntity,
        TutorAnalyticFrequencyEntity,
        TutorAnalyticMonetaryEntity,
        OnlineCourseEntity,
        ClipEntity,
        ClipRatingEntity,
        ClipRatingTransactionEntity,
        ClipTransactionEntity,
        BankEntity,
        OfflineCourseStatisticEntity,
        OnlineCourseStatisticEntity,
        ClipStatisticEntity
    ]
}

export { ormConfig }
