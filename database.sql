-- create schema get_a_dev character set utf8 COLLATE utf8_unicode_ci;
use get_a_dev;

-- OAuth2 table crreate table
CREATE TABLE `authority` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `AUTHORITY_UNIQUE_NAME` UNIQUE (`name`)
);

CREATE TABLE `oauth_access_token` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `authentication` mediumblob,
  `authentication_id` varchar(255) DEFAULT NULL,
  `client_id` varchar(255) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `token` mediumblob,
  `token_id` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `oauth_client_details` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `access_token_validity` int(11) DEFAULT NULL,
  `additional_information` varchar(4096) DEFAULT NULL,
  `authorities` varchar(255) DEFAULT NULL,
  `authorized_grant_types` varchar(255) DEFAULT NULL,
  `autoapprove` tinyint(4) DEFAULT NULL,
  `client_id` varchar(255) DEFAULT NULL,
  `client_name` varchar(255) DEFAULT NULL,
  `client_secret` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT '1',
  `refresh_token_validity` int(11) DEFAULT NULL,
  `resource_ids` varchar(255) DEFAULT NULL,
  `scope` varchar(255) DEFAULT NULL,
  `uuid` varchar(255) DEFAULT NULL,
  `web_server_redirect_uri` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `oauth_client_token` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `authentication_id` varchar(255) DEFAULT NULL,
  `client_id` varchar(255) DEFAULT NULL,
  `token` mediumblob,
  `token_id` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `oauth_code` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `authentication` mediumblob,
  `code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `oauth_refresh_token` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `authentication` mediumblob,
  `token` mediumblob,
  `token_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `user_auth` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `account_expired` bit(1) DEFAULT NULL,
  `account_locked` bit(1) DEFAULT NULL,
  `credentials_expired` bit(1) DEFAULT NULL,
  `enabled` bit(1) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `USER_UNIQUE_USERNAME` UNIQUE (`username`)
);

CREATE TABLE `user_authority` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `authority_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_USER_AUTHORITY_AUTHORITY_ID` FOREIGN KEY (`authority_id`) REFERENCES `authority`(`id`),
  CONSTRAINT `USER_AUTHORITY_UNIQUE_USER_ID_AND_AUTHORITY_ID` UNIQUE (`user_id`,`authority_id`)
);

-- OAuth2 insert data
insert into `oauth_client_details`(`client_id`,`resource_ids`,`client_secret`,`scope`,`authorized_grant_types`,`web_server_redirect_uri`,`authorities`,`access_token_validity`,`refresh_token_validity`,`additional_information`,`autoapprove`) values ('get-a-web','get-a-resource','$2y$04$fHD60h7yueDEE9v5f.vVsOOJJZzICcb2tKyaivMQcSxugVDrVfe.K','read','password,authorization_code,refresh_token,client_credentials,implicit','https://oauth.pstmn.io/v1/callback','USER',10800,2592000,null,null);
insert into `authority`(`name`) values ('ADMIN');
insert into `authority`(`name`) values ('USER');
insert into `user_auth`(`account_expired`,`account_locked`,`credentials_expired`,`enabled`,`password`,`username`) values (0,0,0,1,'$2a$08$qvrzQZ7jJ7oy2p/msL4M0.l83Cd0jNsX6AJUitbgRXGzge4j035ha','admin');
insert into `user_authority`(`authority_id`,`user_id`) values (1,1);


-- Resource database
-- member part
create table `member` (
    `id` bigint(20) UNSIGNED not null AUTO_INCREMENT,
    `firstname` varchar(255) not null,
    `lastname` varchar(255) not null,
    `gender` varchar(10) not null,
    `DoB` date not null,
    `address1` varchar(255) not null,
    `address2` varchar(255),
    `email` varchar(50) not null,
    `username` varchar(50) not null,
    `created` timestamp not null,
    `updated` timestamp,
    PRIMARY KEY (`id`),
    CONSTRAINT `FK_MEMBER_USER_AUTH` FOREIGN KEY (`username`) REFERENCES `user_auth` (`username`),
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
    `member_id` bigint(20) UNSIGNED not null,
    `subject_id` bigint(20) UNSIGNED not null,
    PRIMARY KEY (`id`),
    CONSTRAINT `FK_MEMBER_INTERESTED_SUBJECT` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`),
    CONSTRAINT `FK_SUBJECT_INTERESTED_SUBJECT` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`)
);

create table `member_grade`(
    `id` bigint(20) UNSIGNED not null AUTO_INCREMENT,
    `member_id` bigint(20) UNSIGNED not null,
    `grade_id` bigint(20) UNSIGNED not null,
    PRIMARY KEY (`id`),
    CONSTRAINT `FK_MEMBER_GRADE` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`),
    CONSTRAINT `FK_GRADE` FOREIGN KEY (`grade_id`) REFERENCES `grade` (`id`)
);

-- grade data
insert into `grade` (`name`, `grade_value`) values ('มัธยมศึกษาปีที่ 4', 10), ('มัธยมศึกษาปีที่ 5', 11), ('มัธยมศึกษาปีที่ 6', 12);
insert into `subject` (`name`) values ('คณิตศาสตร์'), ('วิทยาศาสตร์'), ('ภาษาไทย');

