ALTER TABLE  `ib_units` CHANGE  `roty`  `roty` FLOAT( 5, 2 ) NULL DEFAULT  '0';
UPDATE ib_units SET roty = roty * (PI()/180);
ALTER TABLE  `ib_units` CHANGE  `roty`  `roty` FLOAT( 3, 2 ) NULL DEFAULT  '0';

ALTER TABLE  `ib_characters` CHANGE  `roty`  `roty` FLOAT( 5, 2 ) NULL DEFAULT  '0';
UPDATE ib_characters SET roty = roty * (PI()/180);
ALTER TABLE  `ib_characters` CHANGE  `roty`  `roty` FLOAT( 3, 2 ) NULL DEFAULT  '0';