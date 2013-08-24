ALTER TABLE  `ib_characters` ADD  `lastplayed` INT( 10 ) UNSIGNED NOT NULL DEFAULT  '0';
ALTER TABLE  `bcs_users` DROP  `characterused`;