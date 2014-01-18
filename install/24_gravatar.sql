ALTER TABLE `bcs_users`
DROP COLUMN `forum_avatar`,
ADD COLUMN `gravatar_email` VARCHAR(255) NULL AFTER `newsletter`,
ADD COLUMN `character_avatar` INT NOT NULL DEFAULT 0 AFTER `gravatar_email`;