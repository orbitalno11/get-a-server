use get_a_dev;

-- member part
create table member (
    member_id varchar(255) not null,
    firstname varchar(255) not null,
    lastname varchar(255) not null,
    gender varchar(10) not null,
    dateOfBirth date not null,
    profileUrl varchar(255),
    email varchar(50) not null,
    username varchar(50) not null,
    updated timestamp,
    created timestamp,
    PRIMARY KEY (member_id),
    CONSTRAINT `MEMBER_UNIQUE_KEY` UNIQUE (email, username)
);

create table grade(
    grade_id smallint UNSIGNED not null AUTO_INCREMENT,
    grade_title varchar(100) not null,
    grade_value int UNSIGNED not null,
    PRIMARY KEY (grade_id),
    CONSTRAINT `GRADE_UNIQUE_KEY` UNIQUE (grade_title, grade_value)
);

create table subject(
    subject_id smallint UNSIGNED not null AUTO_INCREMENT,
    subject_name varchar(100) not null,
    PRIMARY KEY (subject_id)
);

create table interested_subject(
    interested_subject_id int not null AUTO_INCREMENT,
    subject_rank smallint UNSIGNED not null,
    member_id varchar(255) not null,
    subject_id smallint UNSIGNED not null,
    PRIMARY KEY (interested_subject_id),
    CONSTRAINT `FK_MEMBER_INTERESTED_SUBJECT` FOREIGN KEY (member_id) REFERENCES member (member_id),
    CONSTRAINT `FK_SUBJECT_INTERESTED_SUBJECT` FOREIGN KEY (subject_id) REFERENCES subject (subject_id)
);

create table member_grade(
    member_grade_id int not null AUTO_INCREMENT,
    member_id varchar(255) not null,
    grade_id smallint UNSIGNED not null,
    PRIMARY KEY (member_grade_id),
    CONSTRAINT `FK_MEMBER_GRADE` FOREIGN KEY (member_id) REFERENCES member (member_id),
    CONSTRAINT `FK_GRADE` FOREIGN KEY (grade_id) REFERENCES grade (grade_id)
);

create table role(
    role_id smallint not null,
    role_name varchar(50) not null,
    PRIMARY KEY(role_id)
);

create table member_role(
    member_role_id int not null AUTO_INCREMENT,
    role_id smallint not null,
    member_id varchar(255) not null,
    PRIMARY KEY(member_role_id),
    CONSTRAINT `FK_MEMBER_ROLE` FOREIGN KEY (member_id) REFERENCES member (member_id),
    CONSTRAINT `FK_ROLE` FOREIGN KEY (role_id) REFERENCES role (role_id)
);

-- address and location

create table zone(
  zone_id varchar(100) not null,
  zone_name varchar(100) not null,
  primary key (zone_id)
);

create table province(
  province_id varchar(100) not null,
  province_name varchar(100) not null,
  primary key (province_id)
);

create table district(
  district_id varchar(100) not null,
  district_name varchar(100) not null,
  primary key (district_id)
);

create table sub_district(
  sub_district_id varchar(100) not null,
  sub_district_name varchar(100) not null,
  primary key (sub_district_id)
);

create table member_address(
    address_id int not null AUTO_INCREMENT,
    member_id varchar(255) not null,
    address varchar(255) not null,
    hint_address varchar(255) not null,
    road varchar(255) not null,
    sub_district_id varchar(100) not null,
    district_id varchar(100) not null,
    province_id varchar(100) not null,
    postcode varchar(10) not null,
    type smallint not null,
    PRIMARY KEY(address_id),
    CONSTRAINT `FK_ADDRESS_MEMBER` FOREIGN KEY(member_id) REFERENCES member (member_id),
    CONSTRAINT `FK_ADDRESS_SUB_DISTICT` FOREIGN KEY(sub_district_id) REFERENCES sub_district (sub_district_id),
    CONSTRAINT `FK_ADDRESS_DISTICT` FOREIGN KEY(district_id) REFERENCES district (district_id),
    CONSTRAINT `FK_ADDRESS_PROVINCE` FOREIGN KEY(province_id) REFERENCES province (province_id)
);

create table contact(
    contact_id int not null AUTO_INCREMENT,
    member_id varchar(255) not null,
    phone_number varchar(15) not null,
    line_id varchar(255),
    facebook_url varchar(255),
    PRIMARY KEY(contact_id),
    CONSTRAINT `FK_MEMBER_CONTACT` FOREIGN KEY(member_id) REFERENCES member (member_id)
);

create table self_introduction(
    self_introduction_id int not null AUTO_INCREMENT,
    member_id varchar(255) not null,
    introduction text not null,
    PRIMARY KEY(self_introduction_id),
    CONSTRAINT `FK_MEMBER_INTRODUCTION` FOREIGN KEY(member_id) REFERENCES member(member_id)
);

create table exam_type(
    exam_type_id int not null AUTO_INCREMENT,
    exam_name varchar(255) not null,
    PRIMARY KEY(exam_type_id)
);

create table testing_history(
    testing_id int not null AUTO_INCREMENT,
    member_id varchar(255) not null,
    exam_id int not null,
    testing_score float(10, 3) not null,
    status varchar(100) not null,
    PRIMARY KEY(testing_id),
    CONSTRAINT `FK_MEMBER_TESTING` FOREIGN KEY(member_id) REFERENCES member (member_id),
    CONSTRAINT `FK_TESTING_TYPE` FOREIGN KEY(exam_id) REFERENCES exam_type (exam_type_id)
);

create table institute(
    institute_id int not null AUTO_INCREMENT,
    institute_name varchar(255) not null,
    PRIMARY KEY(institute_id)
);

create table branch(
    branch_id int not null AUTO_INCREMENT,
    branch_name varchar(255) not null,
    PRIMARY KEY(branch_id)
);

create table education_history(
    education_history_id int not null AUTO_INCREMENT,
    member_id varchar(255) not null,
    institute_id int not null,
    branch_id int not null,
    gpax float(3,2) not null,
    status varchar(10) not null,
    PRIMARY KEY(education_history_id),
    CONSTRAINT `FK_MEMBER_EDUCATION` FOREIGN KEY(member_id) REFERENCES member (member_id),
    CONSTRAINT `FK_MEMBER_INSTITUTE` FOREIGN KEY(institute_id) REFERENCES institute (institute_id),
    CONSTRAINT `FK_MEMBER_BRANCH` FOREIGN KEY(branch_id) REFERENCES branch (branch_id)
);

create table member_favorite(
    favorite_id int not null AUTO_INCREMENT,
    owner_id varchar(255) not null,
    member_fav_id varchar(255) not null,
    PRIMARY KEY(favorite_id),
    CONSTRAINT `FK_MEMBER_OWNER` FOREIGN KEY(owner_id) REFERENCES member (member_id),
    CONSTRAINT `FK_MEMBER_FAVORITE` FOREIGN KEY(member_fav_id) REFERENCES member (member_id)
);

-- coin
create table exchange_rate(
    exchange_rate_id int not null AUTO_INCREMENT,
    exchange_name varchar(255) not null,
    exchange_baht float(10,3) not null,
    exchange_coin float(10,3) not null,
    exchange_type varchar(20) not null,
    start_date date not null,
    end_date date,
    updated date,
    PRIMARY KEY(exchange_rate_id) 
);

create table coin(
    coin_id int not null AUTO_INCREMENT,
    member_id varchar(255) not null,
    coin_number float(10,3) not null,
    updated date,
    PRIMARY KEY(coin_id),
    CONSTRAINT `FK_MEMBER_COIN` FOREIGN KEY(member_id) REFERENCES member (member_id)
);

create table exchange_transaction(
    exchange_transaction_id int not null AUTO_INCREMENT,
    member_id varchar(255) not null,
    exchange_rate_id int not null,
    request_date date not null,
    approve_date date,
    transfer_date date,
    PRIMARY KEY(exchange_transaction_id),
    CONSTRAINT `FK_MEMBER_EXCHANGE` FOREIGN KEY(member_id) REFERENCES member (member_id),
    CONSTRAINT `FK_MEMBER_EXCHANGE_RATE` FOREIGN KEY(exchange_rate_id) REFERENCES exchange_rate (exchange_rate_id)
);

-- offline course
create table course_type(
    course_type_id smallint not null,
    course_type_name varchar(20) not null,
    PRIMARY KEY(course_type_id)
);

create table course(
    course_id varchar(255) not null,
    owner_id varchar(255) not null,
    course_type_id smallint not null,
    subject_id smallint UNSIGNED not null,
    grade_id smallint UNSIGNED not null,
    course_name varchar(255) not null,
    course_description text not null,
    course_cost float(10,3) not null,
    course_day smallint not null, -- day of week
    start_time varchar(6) not null,
    end_time varchar(6) not null,
    course_status varchar(10) not null,
    request_number int UNSIGNED not null,
    PRIMARY KEY(course_id),
    CONSTRAINT `FK_COURSE_OWNER` FOREIGN KEY(owner_id) REFERENCES member (member_id),
    CONSTRAINT `FK_COURSE_TYPE` FOREIGN KEY(course_type_id) REFERENCES course_type (course_type_id),
    CONSTRAINT `FK_COURSE_SUBJECT` FOREIGN KEY(subject_id) REFERENCES subject (subject_id),
    CONSTRAINT `FK_COURSE_GRADE` FOREIGN KEY(grade_id) REFERENCES grade (grade_id)
);

create table course_rating(
    course_rating_id int not null AUTO_INCREMENT,
    course_id varchar(255) not null,
    review_number int UNSIGNED not null,
    rating float(3,1) not null,
    PRIMARY KEY(course_rating_id),
    CONSTRAINT `FK_COURSE_RATING_COURSE` FOREIGN KEY(course_id) REFERENCES course (course_id)
);

create table course_rating_transaction(
    rating_transaction_id int not null AUTO_INCREMENT,
    member_id varchar(255) not null,
    course_id varchar(255) not null,
    rating float(3,1) not null,
    review text not null,
    PRIMARY KEY(rating_transaction_id),
    CONSTRAINT `FK_COURSE_RATING_MEMBER` FOREIGN KEY(member_id) REFERENCES member (member_id),
    CONSTRAINT `FK_COURSE_RATING_TRANSACTION_COURSE` FOREIGN KEY(course_id) REFERENCES course (course_id)
);

create table course_learner_request(
    request_id int not null AUTO_INCREMENT,
    member_id varchar(255) not null,
    course_id varchar(255) not null,
    PRIMARY KEY(request_id),
    CONSTRAINT `FK_COURSE_REQUEST_MEMBER` FOREIGN KEY(member_id) REFERENCES member (member_id),
    CONSTRAINT `FK_COURSE_REQUEST_COURSE` FOREIGN KEY(course_id) REFERENCES course (course_id)
);

-- online course
create table online_course(
    course_id varchar(255) not null,
    owner_id varchar(255) not null,
    subject_id smallint UNSIGNED not null,
    grade_id smallint UNSIGNED not null,
    course_name varchar(255) not null,
    PRIMARY KEY(course_id),
    CONSTRAINT `FK_ONLINE_COURSE_OWNER` FOREIGN KEY(owner_id) REFERENCES member (member_id),
    CONSTRAINT `FK_ONLINE_COURSE_SUBJECT` FOREIGN KEY(subject_id) REFERENCES subject (subject_id),
    CONSTRAINT `FK_ONLINE_COURSE_GRADE` FOREIGN KEY(grade_id) REFERENCES grade (grade_id)
);

create table clip(
    clip_id varchar(255) not null,
    owner_id varchar(255) not null,
    course_id varchar(255) not null,
    clip_name varchar(255) not null,
    clip_description text not null,
    clip_url varchar(255),
    clip_cover_url varchar(255),
    PRIMARY KEY(clip_id),
    CONSTRAINT `FK_CLIP_OWNER` FOREIGN KEY(owner_id) REFERENCES member (member_id),
    CONSTRAINT `FK_CLIP_COURSE` FOREIGN KEY(course_id) REFERENCES online_course (course_id)
);

create table learner_clip(
    learner_clip_id int not null AUTO_INCREMENT,
    clip_id varchar(255) not null,
    member_id varchar(255) not null,
    open_time float(10,3) not null,
    PRIMARY KEY(learner_clip_id),
    CONSTRAINT `FK_LEARNER_CLIP_LEARNER` FOREIGN KEY(member_id) REFERENCES member (member_id),
    CONSTRAINT `FK_LEARNER_CLIP_COURSE` FOREIGN KEY(clip_id) REFERENCES clip (clip_id)
);

create table online_course_rating(
    online_course_rating_id int not null AUTO_INCREMENT,
    course_id varchar(255) not null,
    review_number int UNSIGNED not null,
    rating float(3,1) not null,
    PRIMARY KEY(online_course_rating_id),
    CONSTRAINT `FK_ONLINE_COURSE_RATING_COURSE` FOREIGN KEY(course_id) REFERENCES online_course (course_id)
);

create table online_clip_rating(
    online_clip_rating_id int not null AUTO_INCREMENT,
    clip_id varchar(255) not null,
    review_number int UNSIGNED not null,
    rating float(3,1) not null,
    PRIMARY KEY(online_clip_rating_id),
    CONSTRAINT `FK_ONLINE_CLIP_RATING_CLIP` FOREIGN KEY(clip_id) REFERENCES clip (clip_id)
);

create table online_clip_rating_transaction(
    clip_rating_transaction_id int not null AUTO_INCREMENT,
    member_id varchar(255) not null,
    clip_id varchar(255) not null,
    rating float(3,1) not null,
    review text not null,
    PRIMARY KEY(clip_rating_transaction_id),
    CONSTRAINT `FK_CLIP_RATING_MEMBER` FOREIGN KEY(member_id) REFERENCES member (member_id),
    CONSTRAINT `FK_ONLINE_CLIP_RATING_TRANSACTION_CLIP` FOREIGN KEY(clip_id) REFERENCES clip (clip_id)
);

create table clip_transaction(
    transaction_id int not null AUTO_INCREMENT,
    member_id varchar(255) not null,
    clip_id varchar(255) not null,
    amount float(10,3) not null,
    paid_date date not null,
    PRIMARY KEY(transaction_id),
    CONSTRAINT `FK_CLIP_MEMBER` FOREIGN KEY(member_id) REFERENCES member (member_id),
    CONSTRAINT `FK_CLIP_CLIP` FOREIGN KEY(clip_id) REFERENCES clip (clip_id)
);