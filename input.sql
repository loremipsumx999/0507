create database reactasd default character set utf8 collate utf8_hungarian_ci;

use reactasd;

create table users(
	id int primary key AUTO_INCREMENT,
    username varchar(255),
    password varchar(255),
    phone_number varchar(255)
);