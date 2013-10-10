ALTER TABLE `bcs_users` ADD COLUMN newsletter TINYINT DEFAULT 1 not null;
ALTER TABLE `bcs_users` DROP COLUMN enable_editor;
ALTER TABLE `bcs_users` DROP COLUMN pending_editor;