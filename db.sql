use get_a_dev;

-- member part
create table `member` (
    `member_id` varchar(255) not null,
    `firstname` varchar(255) not null,
    `lastname` varchar(255) not null,
    `gender` varchar(10) not null,
    `dateOfBirth` date not null,
    `address1` varchar(255),
    `address2` varchar(255),
    `email` varchar(50) not null,
    `username` varchar(50) not null,
    `created` timestamp not null,
    `updated` timestamp,
    PRIMARY KEY (`member_id`),
    CONSTRAINT `MEMBER_UNIQUE_KEY` UNIQUE (`email`, `username`)
);

create table `grade`(
    `grade_id` bigint(20) UNSIGNED not null AUTO_INCREMENT,
    `name` varchar(100) not null,
    `grade_value` int UNSIGNED not null,
    PRIMARY KEY (`grade_id`),
    CONSTRAINT `GRADE_UNIQUE_KEY` UNIQUE (`name`, `grade_value`)
);

create table `subject`(
    `subject_id` bigint(20) UNSIGNED not null AUTO_INCREMENT,
    `name` varchar(100) not null,
    PRIMARY KEY (`subject_id`)
);

create table `interested_subject`(
    `interested_subject_id` bigint(20) UNSIGNED not null AUTO_INCREMENT,
    `rank` int UNSIGNED not null,
    `member_id` varchar(255) not null,
    `subject_id` bigint(20) UNSIGNED not null,
    PRIMARY KEY (`interested_subject_id`),
    CONSTRAINT `FK_MEMBER_INTERESTED_SUBJECT` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`),
    CONSTRAINT `FK_SUBJECT_INTERESTED_SUBJECT` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`subject_id`)
);

create table `member_grade`(
    `member_grade_id` bigint(20) UNSIGNED not null AUTO_INCREMENT,
    `member_id` varchar(255) not null,
    `grade_id` bigint(20) UNSIGNED not null,
    PRIMARY KEY (`member_grade_id`),
    CONSTRAINT `FK_MEMBER_GRADE` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`),
    CONSTRAINT `FK_GRADE` FOREIGN KEY (`grade_id`) REFERENCES `grade` (`grade_id`)
);

create table `role`(
    `role_id` smallint not null,
    `name` varchar(50) not null,
    PRIMARY KEY(`role_id`)
);

create table `member_role`(
    `member_role_id` int not null AUTO_INCREMENT,
    `role_id` smallint not null,
    `member_id` varchar(255) not null,
    PRIMARY KEY(`member_role_id`),
    CONSTRAINT `FK_MEMBER_ROLE` FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`),
    CONSTRAINT `FK_ROLE` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`)
);

-- grade data
insert into `grade` (`name`, `grade_value`) values ('มัธยมศึกษาปีที่ 4', 10), ('มัธยมศึกษาปีที่ 5', 11), ('มัธยมศึกษาปีที่ 6', 12);
insert into `subject` (`name`) values ('คณิตศาสตร์'), ('วิทยาศาสตร์'), ('ภาษาไทย');
insert into `role` (`role_id`, `name`) values (0, 'admin'), (1, 'learner'), (2, 'tutor'), (3, 'tutor_learner');