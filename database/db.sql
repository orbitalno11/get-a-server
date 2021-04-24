use get_a_dev;

-- member part
create table member (
    id varchar(255) not null,
    firstname varchar(255) not null,
    lastname varchar(255) not null,
    gender smallint UNSIGNED not null,
    dateOfBirth date not null,
    profileUrl varchar(255),
    email varchar(50) not null,
    username varchar(50) not null,
    updated timestamp DEFAULT CURRENT_TIMESTAMP,
    created timestamp DEFAULT '1998-12-11 00:00:00',
    PRIMARY KEY (id),
    CONSTRAINT `MEMBER_UNIQUE_KEY` UNIQUE (email, username)
);

create table grade(
    grade smallint UNSIGNED not null,
    title varchar(100) not null,
    PRIMARY KEY (grade),
    CONSTRAINT `GRADE_UNIQUE_KEY` UNIQUE (title, grade)
);

create table subject(
    code varchar(50) not null,
    title varchar(100) not null,
    PRIMARY KEY (code)
);

create table interested_subject(
    id int not null AUTO_INCREMENT,
    memberId varchar(255) not null,
    subjectRank smallint UNSIGNED not null,
    subjectCode varchar(50) not null,
    PRIMARY KEY (id),
    CONSTRAINT `FK_SUBJECT_INTERESTED_MEMBER` FOREIGN KEY (memberId) REFERENCES member (id),
    CONSTRAINT `FK_SUBJECT_INTERESTED_SUBJECT` FOREIGN KEY (subjectCode) REFERENCES subject (code)
);

create table contact(
    id int not null AUTO_INCREMENT,
    phoneNumber varchar(15) not null,
    lineId varchar(255),
    facebookUrl varchar(255),
    PRIMARY KEY(id)
);

create table role(
    id smallint not null,
    title varchar(50) not null,
    PRIMARY KEY(id)
);

create table member_role(
    id int not null AUTO_INCREMENT,
    roleId smallint not null,
    memberId varchar(255) not null,
    PRIMARY KEY(id),
    CONSTRAINT `FK_MEMBER_ROLE` FOREIGN KEY (memberId) REFERENCES member (id),
    CONSTRAINT `FK_ROLE` FOREIGN KEY (roleId) REFERENCES role (id)
);

-- address and location

create table zone(
  id varchar(100) not null,
  title varchar(100) not null,
  primary key (id)
);

create table province(
  id varchar(100) not null,
  title varchar(100) not null,
  primary key (id)
);

create table district(
  id varchar(100) not null,
  title varchar(100) not null,
  primary key (id)
);

create table sub_district(
  id varchar(100) not null,
  title varchar(100) not null,
  primary key (id)
);

create table member_address(
    id int not null AUTO_INCREMENT,
    memberId varchar(255) not null,
    address varchar(255) not null,
    hintAddress varchar(255) null,
    road varchar(255) null,
    subdistrictId varchar(100) not null,
    districtId varchar(100) not null,
    provinceId varchar(100) not null,
    postcode varchar(10) not null,
    type smallint UNSIGNED not null, -- type for contact address or teaching address
    lat double not null,
    lng double not null,
    PRIMARY KEY(id),
    CONSTRAINT `FK_ADDRESS_MEMBER` FOREIGN KEY(memberId) REFERENCES member (id),
    CONSTRAINT `FK_ADDRESS_SUB_DISTICT` FOREIGN KEY(subdistrictId) REFERENCES sub_district (id),
    CONSTRAINT `FK_ADDRESS_DISTICT` FOREIGN KEY(districtId) REFERENCES district (id),
    CONSTRAINT `FK_ADDRESS_PROVINCE` FOREIGN KEY(provinceId) REFERENCES province (id)
);

create table institute(
    id int not null AUTO_INCREMENT,
    title varchar(255) not null,
    PRIMARY KEY(id)
);

create table branch(
    id int not null AUTO_INCREMENT,
    title varchar(255) not null,
    PRIMARY KEY(id)
);

create table tutor_profile(
    id varchar(255) not null,
    memberId varchar(255) not null,
    contactId int not null,
    introduction text null,
    PRIMARY KEY (id),
    CONSTRAINT `FK_TUTOR_MEMBER` FOREIGN KEY(memberId) REFERENCES member (id),
    CONSTRAINT `FK_TUTOR_CONTACT` FOREIGN KEY(contactId) REFERENCES contact (id)
);

create table learner_profile(
    id varchar(255) not null,
    memberId varchar(255) not null,
    contactId int not null,
    gradeId smallint UNSIGNED not null,
    PRIMARY KEY (id),
    CONSTRAINT `FK_LEARNER_MEMBER` FOREIGN KEY(memberId) REFERENCES member (id),
    CONSTRAINT `FK_LEARNER_CONTACT` FOREIGN KEY(contactId) REFERENCES contact (id),
    CONSTRAINT `FK_LEARNER_GRADE` FOREIGN KEY (gradeId) REFERENCES grade (grade)
);

create table favorite_tutor (
    id int not null AUTO_INCREMENT,
    ownerId varchar(255) not null,
    tutorId varchar(255) not null,
    PRIMARY KEY(id),
    CONSTRAINT `FK_MEMBER_OWNER` FOREIGN KEY(ownerId) REFERENCES learner_profile (id),
    CONSTRAINT `FK_MEMBER_FAVORITE` FOREIGN KEY(tutorId) REFERENCES tutor_profile (id)
);

create table exam_type(
    id int not null AUTO_INCREMENT,
    title varchar(255) not null,
    PRIMARY KEY(id)
);

create table testing_history(
    id int not null AUTO_INCREMENT,
    tutorId varchar(255) not null,
    examId int not null,
    testingScore float(10, 3) not null,
    status varchar(100) not null,
    PRIMARY KEY(id),
    CONSTRAINT `FK_TESTING_TUTOR` FOREIGN KEY(tutorId) REFERENCES tutor_profile (id),
    CONSTRAINT `FK_TESTING_TYPE` FOREIGN KEY(examId) REFERENCES exam_type (id)
);

create table education_history(
    id int not null AUTO_INCREMENT,
    tutorId varchar(255) not null,
    instituteId int not null,
    branchId int not null,
    gpax float(3,2) not null,
    status varchar(10) not null,
    PRIMARY KEY(id),
    CONSTRAINT `FK_EDUCATION_TUTOR` FOREIGN KEY(tutorId) REFERENCES tutor_profile (id),
    CONSTRAINT `FK_EDUCATION_INSTITUTE` FOREIGN KEY(instituteId) REFERENCES institute (id),
    CONSTRAINT `FK_ECUCATION_BRANCH` FOREIGN KEY(branchId) REFERENCES branch (id)
);

-- coin
create table exchange_rate(
    id int not null AUTO_INCREMENT,
    title varchar(255) not null,
    baht float(10,3) not null,
    coin float(10,3) not null,
    type varchar(20) not null,
    startDate timestamp not null DEFAULT CURRENT_TIMESTAMP,
    endDate timestamp,
    updated timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id) 
);

create table coin(
    id int not null AUTO_INCREMENT,
    memberId varchar(255) not null,
    amount float(10,3) not null,
    updated timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    CONSTRAINT `FK_MEMBER_COIN` FOREIGN KEY(memberId) REFERENCES member (id)
);

create table exchange_transaction(
    id int not null AUTO_INCREMENT,
    memberId varchar(255) not null,
    exchangeRateId int not null,
    requestDate timestamp not null default current_timestamp,
    approveDate timestamp,
    transferDate timestamp,
    PRIMARY KEY(id),
    CONSTRAINT `FK_MEMBER_EXCHANGE` FOREIGN KEY(memberId) REFERENCES member (id),
    CONSTRAINT `FK_MEMBER_EXCHANGE_RATE` FOREIGN KEY(exchangeRateId) REFERENCES exchange_rate (id)
);

create table coin_transaction(
    transaction_id varchar(255) not null,
    paymentId varchar(255),
    memberId varchar(255) not null,
    exchangeRateId int not null,
    transactionDate timestamp not null default current_timestamp,
    paymentStatus smallint UNSIGNED not null,
    refNo1 varchar(20) not null,
    refNo2 varchar(20) not null,
    refNo3 varchar(20) not null,
    PRIMARY KEY(transaction_id),
    CONSTRAINT `FK_MEMBER_COIN_TRANSACTION` FOREIGN KEY(memberId) REFERENCES member (id),
    CONSTRAINT `FK_MEMBER_COIN_RATE_TRANSACTION` FOREIGN KEY(exchangeRateId) REFERENCES exchange_rate (id)
);

-- offline course
create table course_type(
    id smallint not null,
    title varchar(20) not null,
    PRIMARY KEY(id)
);

create table course(
    id varchar(255) not null,
    ownerId varchar(255) not null,
    courseTypeId smallint not null,
    subjectCode varchar(50) not null,
    gradeId smallint UNSIGNED not null,
    name varchar(255) not null,
    description text not null,
    cost float(10,3) not null,
    day smallint not null, -- day of week
    startTime varchar(6) not null,
    endTime varchar(6) not null,
    status varchar(10) not null,
    requestNumber int UNSIGNED not null,
    studentNumber int UNSIGNED not null,
    PRIMARY KEY(id),
    CONSTRAINT `FK_COURSE_OWNER` FOREIGN KEY(ownerId) REFERENCES tutor_profile (id),
    CONSTRAINT `FK_COURSE_TYPE` FOREIGN KEY(courseTypeId) REFERENCES course_type (id),
    CONSTRAINT `FK_COURSE_SUBJECT` FOREIGN KEY(subjectCode) REFERENCES subject (code),
    CONSTRAINT `FK_COURSE_GRADE` FOREIGN KEY(gradeId) REFERENCES grade (grade)
);

create table course_rating(
    id int not null AUTO_INCREMENT,
    courseId varchar(255) not null,
    reviewNumber int UNSIGNED not null,
    rating float(3,1) not null,
    PRIMARY KEY(id),
    CONSTRAINT `FK_COURSE_RATING_COURSE` FOREIGN KEY(courseId) REFERENCES course (id)
);

create table course_rating_transaction(
    id int not null AUTO_INCREMENT,
    learnerId varchar(255) not null,
    courseId varchar(255) not null,
    rating float(3,1) not null,
    review text not null,
    reviewDate timestamp not null default current_timestamp,
    PRIMARY KEY(id),
    CONSTRAINT `FK_COURSE_RATING_BY_LEARNER` FOREIGN KEY(learnerId) REFERENCES learner_profile (id),
    CONSTRAINT `FK_COURSE_RATING_TRANSACTION_COURSE` FOREIGN KEY(courseId) REFERENCES course (id)
);

create table course_learner_request(
    id int not null AUTO_INCREMENT,
    learnerId varchar(255) not null,
    courseId varchar(255) not null,
    status smallint UNSIGNED not null,
    PRIMARY KEY(id),
    CONSTRAINT `FK_COURSE_LEARNER_REQUEST` FOREIGN KEY(learnerId) REFERENCES learner_profile (id),
    CONSTRAINT `FK_COURSE_LEARNER_REQUEST_COURSE` FOREIGN KEY(courseId) REFERENCES course (id)
);

-- online course
create table online_course(
    id varchar(255) not null,
    ownerId varchar(255) not null,
    subjectCode varchar(50) not null,
    gradeId smallint UNSIGNED not null,
    courseName varchar(255) not null,
    PRIMARY KEY(id),
    CONSTRAINT `FK_ONLINE_COURSE_OWNER` FOREIGN KEY(ownerId) REFERENCES tutor_profile (id),
    CONSTRAINT `FK_ONLINE_COURSE_SUBJECT` FOREIGN KEY(subjectCode) REFERENCES subject (code),
    CONSTRAINT `FK_ONLINE_COURSE_GRADE` FOREIGN KEY(gradeId) REFERENCES grade (grade)
);

create table clip(
    id varchar(255) not null,
    ownerId varchar(255) not null,
    onlineCourseId varchar(255) not null,
    name varchar(255) not null,
    description text not null,
    url varchar(255),
    coverUrl varchar(255),
    PRIMARY KEY(id),
    CONSTRAINT `FK_CLIP_OWNER` FOREIGN KEY(ownerId) REFERENCES tutor_profile (id),
    CONSTRAINT `FK_CLIP_COURSE` FOREIGN KEY(onlineCourseId) REFERENCES online_course (id)
);

create table learner_clip(
    id int not null AUTO_INCREMENT,
    clipId varchar(255) not null,
    learnerId varchar(255) not null,
    playTime float(10,3) not null,
    PRIMARY KEY(id),
    CONSTRAINT `FK_LEARNER_CLIP_LEARNER` FOREIGN KEY(learnerId) REFERENCES learner_profile (id),
    CONSTRAINT `FK_LEARNER_CLIP_COURSE` FOREIGN KEY(clipId) REFERENCES clip (id)
);

create table online_course_rating(
    id int not null AUTO_INCREMENT,
    onlineCourseId varchar(255) not null,
    reviewNumber int UNSIGNED not null,
    rating float(3,1) not null,
    PRIMARY KEY(id),
    CONSTRAINT `FK_ONLINE_COURSE_RATING_COURSE` FOREIGN KEY(onlineCourseId) REFERENCES online_course (id)
);

create table online_clip_rating(
    id int not null AUTO_INCREMENT,
    clipId varchar(255) not null,
    reviewNumber int UNSIGNED not null,
    rating float(3,1) not null,
    PRIMARY KEY(id),
    CONSTRAINT `FK_ONLINE_CLIP_RATING_CLIP` FOREIGN KEY(clipId) REFERENCES clip (id)
);

create table online_clip_rating_transaction(
    id int not null AUTO_INCREMENT,
    learnerId varchar(255) not null,
    clipId varchar(255) not null,
    rating float(3,1) not null,
    review text not null,
    reviewDate timestamp not null default current_timestamp,
    PRIMARY KEY(id),
    CONSTRAINT `FK_CLIP_RATING_BY_LEARNER` FOREIGN KEY(learnerId) REFERENCES learner_profile (id),
    CONSTRAINT `FK_ONLINE_CLIP_RATING_TRANSACTION_CLIP` FOREIGN KEY(clipId) REFERENCES clip (id)
);

create table clip_transaction(
    id int not null AUTO_INCREMENT,
    learnerId varchar(255) not null,
    clipId varchar(255) not null,
    amount float(10,3) not null,
    paidDate timestamp not null default current_timestamp,
    PRIMARY KEY(id),
    CONSTRAINT `FK_CLIP_LEARNER` FOREIGN KEY(learnerId) REFERENCES learner_profile (id),
    CONSTRAINT `FK_CLIP_CLIP` FOREIGN KEY(clipId) REFERENCES clip (id)
);