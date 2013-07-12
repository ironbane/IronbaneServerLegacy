UPDATE bcs_users SET email='guest@ironbane.com', password='n0tp4ssw0rd', name='guest' WHERE id=0;

DELETE FROM bcs_users WHERE email = '';
DELETE FROM bcs_users WHERE name='test8' AND email='info@nickjanssen.com';

ALTER TABLE `bcs_users` CHANGE COLUMN `email` `email` VARCHAR(255) NOT NULL  ,
CHANGE COLUMN `activationkey` `activationkey` VARCHAR(255) NULL  ,
CHANGE COLUMN `characterused` `characterused` INT(10) UNSIGNED NOT NULL DEFAULT 0  ,
CHANGE COLUMN `rep` `rep` INT(10) NOT NULL DEFAULT '1'

, ADD UNIQUE INDEX `email_UNIQUE` (`email` ASC)

, ADD UNIQUE INDEX `name_UNIQUE` (`name` ASC) ;