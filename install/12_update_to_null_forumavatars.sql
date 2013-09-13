ALTER TABLE bcs_users MODIFY COLUMN `forum_avatar` varchar(100) DEFAULT NULL;
UPDATE bcs_users SET forum_avatar = NULL WHERE forum_avatar = "theme/images/noavatar.png";