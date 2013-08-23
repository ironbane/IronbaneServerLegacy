ALTER TABLE `forum_topics` ADD COLUMN `title` TEXT NOT NULL  AFTER `guild` ;
ALTER TABLE `forum_topics` ADD COLUMN `locked` BIT NOT NULL DEFAULT 0  AFTER `title` ;