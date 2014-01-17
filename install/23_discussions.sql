CREATE TABLE `discussions` (
  `id` VARCHAR(45) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `body` TEXT NOT NULL,
  `author_id` INT NOT NULL,
  `created_on` INT NOT NULL,
  `locked` TINYINT(1) NOT NULL DEFAULT 0,
  `sticky` TINYINT(1) NOT NULL DEFAULT 0,
  `parent` VARCHAR(45) NULL,
  `parent_thread` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `discussions_tags` (
  `discussion_id` VARCHAR(45) NOT NULL,
  `tag` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`discussion_id`, `tag`));