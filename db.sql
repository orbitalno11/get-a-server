use get_a_dev;

-- member part
create table `member` (
    `id` varchar(255) not null,
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
    PRIMARY KEY (`id`),
    CONSTRAINT `MEMBER_UNIQUE_KEY` UNIQUE (`email`, `username`)
);

create table `grade`(
    `id` bigint(20) UNSIGNED not null AUTO_INCREMENT,
    `name` varchar(100) not null,
    `grade_value` int UNSIGNED not null,
    PRIMARY KEY (`id`),
    CONSTRAINT `GRADE_UNIQUE_KEY` UNIQUE (`name`, `grade_value`)
);

create table `subject`(
    `id` bigint(20) UNSIGNED not null AUTO_INCREMENT,
    `name` varchar(100) not null,
    PRIMARY KEY (`id`)
);

create table `interested_subject`(
    `id` bigint(20) UNSIGNED not null AUTO_INCREMENT,
    `rank` int UNSIGNED not null,
    `member_id` varchar(255) not null,
    `subject_id` bigint(20) UNSIGNED not null,
    PRIMARY KEY (`id`),
    CONSTRAINT `FK_MEMBER_INTERESTED_SUBJECT` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`),
    CONSTRAINT `FK_SUBJECT_INTERESTED_SUBJECT` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`)
);

create table `member_grade`(
    `id` bigint(20) UNSIGNED not null AUTO_INCREMENT,
    `member_id` varchar(255) not null,
    `grade_id` bigint(20) UNSIGNED not null,
    PRIMARY KEY (`id`),
    CONSTRAINT `FK_MEMBER_GRADE` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`),
    CONSTRAINT `FK_GRADE` FOREIGN KEY (`grade_id`) REFERENCES `grade` (`id`)
);

-- grade data
insert into `grade` (`name`, `grade_value`) values ('มัธยมศึกษาปีที่ 4', 10), ('มัธยมศึกษาปีที่ 5', 11), ('มัธยมศึกษาปีที่ 6', 12);
insert into `subject` (`name`) values ('คณิตศาสตร์'), ('วิทยาศาสตร์'), ('ภาษาไทย');