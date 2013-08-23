CREATE TABLE `characters_friends` (
  `id` INT NOT NULL ,
  `character_id` INT NOT NULL ,
  `friend_id` INT NOT NULL ,
  `date_added` INT NOT NULL ,
  `tags` TEXT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `friend` (`character_id` ASC, `friend_id` ASC) );