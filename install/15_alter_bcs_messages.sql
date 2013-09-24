alter table `bcs_messages` add from_character int;
alter table `bcs_messages` add to_character int;
alter table `bcs_messages` modify column `read` datetime;
alter table `bcs_messages` drop owner;
alter table `bcs_messages` add column to_deleted tinyint default 0;
alter table `bcs_messages` add column from_deleted tinyint default 0;