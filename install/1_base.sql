# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.1.44)
# Database: ironbane_dev
# Generation Time: 2013-08-23 10:48:55 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table bcs_users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `bcs_users`;

CREATE TABLE `bcs_users` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `admin` tinyint(1) NOT NULL DEFAULT '0',
  `editor` tinyint(1) NOT NULL DEFAULT '0',
  `moderator` tinyint(1) NOT NULL DEFAULT '0',
  `pass` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL,
  `show_email` tinyint(1) NOT NULL DEFAULT '0',
  `gmt` float(2,1) NOT NULL DEFAULT '1.0',
  `reg_date` int(10) NOT NULL DEFAULT '0',
  `forum_avatar` varchar(100) NOT NULL DEFAULT 'theme/images/noavatar.png',
  `forum_sig` varchar(255) NOT NULL DEFAULT '',
  `forum_posts` int(20) NOT NULL DEFAULT '0',
  `info_realname` varchar(50) NOT NULL DEFAULT '',
  `info_country` varchar(50) NOT NULL DEFAULT '',
  `info_location` varchar(50) NOT NULL DEFAULT '',
  `info_birthday` varchar(10) NOT NULL DEFAULT '0',
  `info_gender` tinyint(1) NOT NULL DEFAULT '0',
  `info_occupation` varchar(50) NOT NULL DEFAULT '',
  `info_interests` varchar(50) NOT NULL DEFAULT '',
  `info_browser` varchar(50) NOT NULL DEFAULT '',
  `info_width` int(5) NOT NULL DEFAULT '0',
  `info_website` varchar(255) NOT NULL DEFAULT '',
  `last_session` int(10) NOT NULL DEFAULT '0',
  `previous_session` int(10) NOT NULL DEFAULT '0',
  `receive_email` tinyint(1) NOT NULL DEFAULT '1',
  `invisible` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `activationkey` varchar(255) NOT NULL DEFAULT '',
  `characterused` int(10) unsigned NOT NULL DEFAULT '0',
  `banned` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `rep` int(10) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

LOCK TABLES `bcs_users` WRITE;
/*!40000 ALTER TABLE `bcs_users` DISABLE KEYS */;

INSERT INTO `bcs_users` (`id`, `name`, `admin`, `editor`, `moderator`, `pass`, `email`, `show_email`, `gmt`, `reg_date`, `forum_avatar`, `forum_sig`, `forum_posts`, `info_realname`, `info_country`, `info_location`, `info_birthday`, `info_gender`, `info_occupation`, `info_interests`, `info_browser`, `info_width`, `info_website`, `last_session`, `previous_session`, `receive_email`, `invisible`, `activationkey`, `characterused`, `banned`, `rep`)
VALUES
	(0,'guest',0,0,0,'n0tp4ssw0rd','guest@ironbane.com',0,1.0,0,'theme/images/noavatar.png','',7,'','','','0',0,'','','',0,'',UNIX_TIMESTAMP(now()),UNIX_TIMESTAMP(now()),1,0,'',0,0,1),
	(1,'admin',1,1,1,'d26ca6f9dd09dd7a7d7a4bbd3dde29cc','',0,1.0,0,'theme/images/noavatar.png','',0,'','','','0',0,'','','',0,'',UNIX_TIMESTAMP(now()),UNIX_TIMESTAMP(now()),1,0,'',0,0,1);

/*!40000 ALTER TABLE `bcs_users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table forum_boards
# ------------------------------------------------------------

DROP TABLE IF EXISTS `forum_boards`;

CREATE TABLE `forum_boards` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `forumcat` int(20) NOT NULL,
  `description` varchar(255) NOT NULL DEFAULT '',
  `moderatable` tinyint(1) NOT NULL DEFAULT '1',
  `order` tinyint(1) NOT NULL DEFAULT '0',
  `mod_only` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

LOCK TABLES `forum_boards` WRITE;
/*!40000 ALTER TABLE `forum_boards` DISABLE KEYS */;

INSERT INTO `forum_boards` (`id`, `name`, `forumcat`, `description`, `moderatable`, `order`, `mod_only`)
VALUES
	(1,'General',1,'General discussion about Ironbane.',1,1,0),
	(2,'Suggestions',1,'Just thought of something wickedly cool? Surprise us!',1,3,0),
	(3,'Support',1,'If you require assistance killing that gigantic boar, feel free to ask here.',1,2,0),
	(5,'Bugs',1,'Found something you could annoy a developer with? Report it here!',1,5,0),
	(6,'Off-Topic',1,'For all your overly dramatic posts. And humble discussions, too!',1,6,0),
	(7,'News',2,'The latest headlines about Ironbane.',0,0,0),
	(8,'Introductions',1,'Come on, don\'t be shy! Tell us a little about yourself!',1,0,0),
	(19,'Music',4,'Discuss the language of the soul with fellow composers.',1,38,0),
	(10,'Story',4,'Discuss things related to Ironbane\'s story.',0,20,0),
	(11,'Gameplay',4,'Talk about the different game mechanics, and which you think is cool for the game.',0,30,0),
	(12,'Using the Editors',4,'Ask any questions you have on game commands, level editing and others.',1,40,0),
	(13,'Editor Suggestions & Bugs',4,'Discuss things you think would be nice to have, or a nasty bug you found.',1,50,0),
	(15,'Graphics',4,'For our beloved artists, talk about pixels, sprites, art and a lot more.',1,35,0),
	(17,'Code',4,'Need help with the code or setting things up? Ask here.',1,15,0),
	(18,'3D Modeling',4,'The place to go for modeling questions, tips and tricks to make things look good.',1,36,0),
	(20,'Sound Effects',4,'Boom! Splash! Eek! Go here to discuss the magic about making good sound effects.',1,39,0);

/*!40000 ALTER TABLE `forum_boards` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table forum_cats
# ------------------------------------------------------------

DROP TABLE IF EXISTS `forum_cats`;

CREATE TABLE `forum_cats` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `order` int(20) NOT NULL,
  `modonly` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `forum_cats` WRITE;
/*!40000 ALTER TABLE `forum_cats` DISABLE KEYS */;

INSERT INTO `forum_cats` (`id`, `name`, `order`, `modonly`)
VALUES
	(1,'General',3,0),
	(2,'Announcements',1,0),
	(4,'Contributing',2,0);

/*!40000 ALTER TABLE `forum_cats` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table forum_posts
# ------------------------------------------------------------

DROP TABLE IF EXISTS `forum_posts`;

CREATE TABLE `forum_posts` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `user` int(10) NOT NULL DEFAULT '0',
  `time` int(10) NOT NULL DEFAULT '0',
  `topic_id` int(10) NOT NULL DEFAULT '0',
  `lastedit_time` int(20) NOT NULL DEFAULT '0',
  `lastedit_count` int(20) NOT NULL DEFAULT '0',
  `lastedit_author` int(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `topic_id` (`topic_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table forum_topics
# ------------------------------------------------------------

DROP TABLE IF EXISTS `forum_topics`;

CREATE TABLE `forum_topics` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `board_id` int(10) NOT NULL DEFAULT '0',
  `time` int(20) NOT NULL DEFAULT '0',
  `private` tinyint(1) NOT NULL DEFAULT '0',
  `private_chatters` varchar(255) NOT NULL DEFAULT '',
  `private_from` int(10) NOT NULL DEFAULT '0',
  `views` int(20) NOT NULL DEFAULT '0',
  `sticky` tinyint(1) NOT NULL DEFAULT '0',
  `guild` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `board_id` (`board_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table ib_bans
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ib_bans`;

CREATE TABLE `ib_bans` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ip` varchar(50) DEFAULT NULL,
  `account` int(10) unsigned DEFAULT '0',
  `until` int(10) unsigned DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table ib_books
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ib_books`;

CREATE TABLE `ib_books` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'This ID must be put in the ''attr1'' field of the book item. Leave blank to auto generate if you''re making a new book.',
  `title` varchar(255) NOT NULL COMMENT 'Only used for yourself to keep things organised :)',
  `text` text NOT NULL COMMENT 'The content of the book. <b>Use the ''&#124;'' character to separate pages.</b>|textarea',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `ib_books` WRITE;
/*!40000 ALTER TABLE `ib_books` DISABLE KEYS */;

INSERT INTO `ib_books` (`id`, `title`, `text`)
VALUES
	(1,'Saturn','Saturn is the sixth planet from the Sun and the second largest planet in the Solar System, after Jupiter. Named after the Roman god Saturn, its astronomical symbol (?) represents the god\'s sickle. Saturn is a gas giant with an average radius about nine times that of Earth.[12][13] While only one-eighth the average density of Earth, with its larger volume Saturn is just over 95 times as massive as Earth.[14][15][16]&nbsp;<div><br></div><div>|</div><div><br></div><div>Saturn\'s interior is probably composed of a core of iron, nickel and rock (silicon and oxygen compounds), surrounded by a deep layer of metallic hydrogen, an intermediate layer of liquid hydrogen and liquid helium and an outer gaseous layer.[17] The planet exhibits a pale yellow hue due to ammonia crystals in its upper atmosphere. Electrical current within the metallic hydrogen layer is thought to give rise to Saturn\'s planetary magnetic field, which is slightly weaker than Earth\'s and around one-twentieth the strength of Jupiter\'s.[18] The outer atmosphere is generally bland and lacking in contrast, although long-lived features can appear.&nbsp;</div><div><br></div><div>|</div><div><br></div><div>Wind speeds on Saturn can reach 1,800 km/h (1,100 mph), faster than on Jupiter, but not as fast as those on Neptune.[19]\r\nSaturn has a prominent ring system that consists of nine continuous main rings and three discontinuous arcs, composed mostly of ice particles with a smaller amount of rocky debris and dust. Sixty-two[20] known moons orbit the planet; fifty-three are officially named. This does not include the hundreds of \"moonlets\" within the rings. Titan, Saturn\'s largest and the Solar System\'s second largest moon, is larger than the planet Mercury and is the only moon in the Solar System to retain a substantial atmosphere.[21]</div>'),
	(3,'How to Fly: For Dummies!','<b><font size=\"4\">Flying for Dummies!</font></b><div><b><br></b><div>Get some of your friends to come over to your house, and then jump up and down like a chicken and flap your arms.&nbsp;</div><div>|</div><div>Also, look in the dictionary for the word gullible, because it isn\'t there.</div></div>'),
	(2,'Fibula Spear','<div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div>The great and powerful Fibula Spear. A most precious possession that has been handed down from father to son in my family for many generations. To think that it would come to this, however; that I would die alone from this terrible illness, with no heir - not even a daughter - to hand the spear over to when I have gone from this world.&nbsp;<div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><span style=\"font-size: 10px;\">|</span><br><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div>The doctors said I don\'t have much longer to live, so while I draw my last breath I give to ye, dear stranger, a clue - a hint, if you may - of where I stowed away my beloved spear. It is unfortunate that I cannot pass it on to a son of mine, but I think my spirit will be satisfied knowing that it\'ll soon be in the hands of a brave, strong and true warrior. Because where I hid it, friend... you better most certainly hope you that are.</div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><span style=\"font-size: 10px;\">|</span></div></div><div><span style=\"font-size: 10px;\"><br></span></div><div><font size=\"1\">\"Liquefied Magenta in your grasp,</font></div><div><font size=\"1\">Surely, it will aid you in your task</font></div><div><font size=\"1\">Find the lonely, weeping asp,</font></div><div><font size=\"1\">And pour the lilac for a dismal gasp,</font></div><div><font size=\"1\"><br></font></div><div><font size=\"1\">The gasp will unlock, so hear me now,</font></div><div><font size=\"1\">An egress of death that will endow,</font></div><div><font size=\"1\">Upon you a partisan as broad as bough,</font></div><div><font size=\"1\">There\'s death, doom and glory ahead; that I vow.</font></div><div><font size=\"1\"><br></font></div><div><font size=\"1\">--Elenor, G. Dragonswell</font></div>'),
	(4,'Fake Spellbook','<font size=\"6\">D - o - g. That\'s how you spell dog.&nbsp;</font><div><br></div><div>|<br><div><br></div><div><font size=\"6\">C - a - t. That\'s how you spell cat.</font></div><div><br></div><div>|</div><div><br></div><div><font size=\"6\">G - o - a - t. That\'s how you spell goat.</font></div><div><br></div><div>|</div><div><br></div><div><font size=\"6\">F - i - s - h. That\'s how you spell fish.</font></div><div><br></div><div>|</div><div><br></div><div><font size=\"6\">C - o - w. That\'s how you spell cow.</font></div><div><br></div><div>|</div><div><br></div><div><font size=\"6\">P - i - g. That\'s how you spell pig.</font></div></div><div><br></div><div>|</div><div><br></div><div><font size=\"6\">The end</font></div>'),
	(5,'Mari-Ann\'s Diary','Dear Diary,<div><br></div><div>Today marks the anniversary of the death of my husband. During these last three years I\'ve slowly come to terms with it - the fact that my dearly beloved was torn away from me in that horrible accident - and in overall I am fine. Most of the time, anyway. However, around every time of this day of the year I find myself sobbing and yelling out for him at night; I just miss him so much.&nbsp;</div><div><br></div><div>But the pain will pass. As always. The thoughts and images that flash through my head at night will dissipate. I must be strong - for both mine and our son\'s sake.</div><div><br></div><div>|</div><div><br></div><div>Dear Diary,</div><div><br></div><div>My son had to wake me last night for I was screaming in my sleep. I frequently have the same nightmare over and over, and I always wake up weeping, but this time it was different, though; I haven\'t felt such dread and hopelessness over the dream since the first days after my husband passed away. It took a while before my son could calm me down from hysteric sobbing, but after playing on that flute of his, I felt a lot better. It never fails cheering me up. I feel so ashamed over the fact that my 9 year old so has to be the one comforting me more often that it is the other way around.&nbsp;</div><div><br></div><div>|</div><div><br></div><div>Dear Diary,</div><div><br></div><div>I\'m watching my son through the window as I\'m writing this. He climbed a tree and is sitting perched on top of one of the branches, playing the flute again. Oh, boy... I think he treasures that flute more than anything else in the whole world. If it wasn\'t for the fact that I cook for him, he\'d probably never come in the house (and forget who I am, for that matter!). Yes, he spends almost every single day outside, laying around in the grass, or on a rock, or hanging from a tree branch - always playing his flute. I can\'t say I blame him for having such attachment to it; after all, it was his father\'s flute.&nbsp;</div><div><br></div><div>|</div><div><br></div><div>Dear Diary,</div><div><br></div><div>My son came to me last night and told me the most peculiar thing;</div>');

/*!40000 ALTER TABLE `ib_books` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table ib_characters
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ib_characters`;

CREATE TABLE `ib_characters` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `x` int(10) NOT NULL DEFAULT '42',
  `y` int(10) NOT NULL DEFAULT '57',
  `z` int(10) NOT NULL DEFAULT '59',
  `zone` smallint(4) unsigned NOT NULL DEFAULT '3',
  `health` smallint(4) unsigned NOT NULL DEFAULT '20',
  `armor` smallint(4) unsigned NOT NULL DEFAULT '0',
  `coins` smallint(4) unsigned NOT NULL DEFAULT '0',
  `level` smallint(4) unsigned NOT NULL DEFAULT '1',
  `user` int(10) NOT NULL,
  `roty` smallint(3) NOT NULL DEFAULT '270',
  `size` float(4,2) unsigned NOT NULL DEFAULT '1.00',
  `skin` smallint(4) unsigned NOT NULL DEFAULT '1',
  `eyes` smallint(4) unsigned NOT NULL DEFAULT '1',
  `hair` smallint(4) unsigned NOT NULL DEFAULT '1',
  `heartpieces` text NOT NULL,
  `creationtime` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table ib_config
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ib_config`;

CREATE TABLE `ib_config` (
  `name` varchar(50) DEFAULT NULL,
  `value` varchar(50) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table ib_editor_cats
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ib_editor_cats`;

CREATE TABLE `ib_editor_cats` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `range` varchar(255) DEFAULT NULL,
  `limit_x` tinyint(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `ib_editor_cats` WRITE;
/*!40000 ALTER TABLE `ib_editor_cats` DISABLE KEYS */;

INSERT INTO `ib_editor_cats` (`id`, `name`, `range`, `limit_x`)
VALUES
	(1,'Alpha tiles','1-100',10),
	(2,'Special','1650-1700',10);

/*!40000 ALTER TABLE `ib_editor_cats` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table ib_item_templates
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ib_item_templates`;

CREATE TABLE `ib_item_templates` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Leave blank if you''re making a new item and you''d like this to be set automatically',
  `name` varchar(30) NOT NULL,
  `image` smallint(4) unsigned NOT NULL DEFAULT '0' COMMENT 'An image ID to be used for this item. See Uploads: Items.',
  `type` varchar(10) NOT NULL COMMENT 'Can be one of the following values:<br><br>weapon<br>armor<br>tool',
  `subtype` varchar(20) NOT NULL COMMENT 'Can be one of the following values:<br><br>For type <b>weapon</b>:<br>sword<br>axe<br>dagger<br>bow<br>staff<br><br>For type <b>armor</b>:<br>head<br>body<br>feet<br><br>For type <b>tool</b>:<br>key<br>book',
  `attr1` smallint(4) NOT NULL DEFAULT '0' COMMENT 'For weapons and armor: The amount of damage/armor this item provides<br><br>For keys: the door ID this key will open<br><br>For books: the book ID this item refers to',
  `delay` float(4,2) unsigned NOT NULL DEFAULT '1.00' COMMENT 'Seconds between attacks/uses',
  `particle` varchar(20) NOT NULL COMMENT 'Leave blank and tell Nick what you want this item to look like/do when you use it',
  `charimage` smallint(4) unsigned NOT NULL DEFAULT '0' COMMENT 'UNUSED',
  `basevalue` int(11) NOT NULL DEFAULT '0' COMMENT 'base value for price before any modifiers.',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `ib_item_templates` WRITE;
/*!40000 ALTER TABLE `ib_item_templates` DISABLE KEYS */;

INSERT INTO `ib_item_templates` (`id`, `name`, `image`, `type`, `subtype`, `attr1`, `delay`, `particle`, `charimage`, `basevalue`)
VALUES
	(1,'Dull Sword',14,'weapon','sword',1,0.50,'',0,0),
	(18,'Iron Helmet',2,'armor','head',2,1.00,'',0,4),
	(5,'Wooden Helmet',1,'armor','head',1,1.00,'',1,4),
	(6,'Wooden Armor',1,'armor','body',1,1.00,'',1,4),
	(7,'Wooden Leggings',1,'armor','feet',1,1.00,'',1,4),
	(8,'Old Bow',5,'weapon','bow',1,1.25,'ARROW',0,10),
	(9,'Acid Staff',15,'weapon','staff',3,1.50,'ACIDBALL',0,4),
	(10,'Firewand',16,'weapon','staff',4,1.00,'FIREBALL',0,50),
	(11,'Book',8,'tool','book',2,1.00,'',0,4),
	(12,'Bone Thrower',138,'weapon','staff',2,1.00,'BONE',0,4),
	(13,'Meat on the Bones',9,'consumable','restorative',3,1.00,'',0,6),
	(14,'Bottle of Wine',10,'consumable','restorative',1,1.00,'HEALSPARKS',0,2),
	(15,'Red Apple',11,'consumable','restorative',2,1.00,'',0,1),
	(16,'Health Potion',12,'consumable','restorative',20,1.00,'HEALSPARKS',0,20),
	(17,'Scroll',13,'tool','book',0,1.00,'',0,0),
	(19,'Iron Armor',2,'armor','body',2,1.00,'',0,4),
	(20,'Iron Leggings',2,'armor','feet',2,1.00,'',0,4),
	(21,'Plasma Staff',88,'weapon','staff',4,2.00,'PLASMABALL',0,8),
	(22,'Bone Sword',1,'weapon','sword',3,2.00,'',0,8),
	(23,'Alabaster Axe',25,'weapon','axe',10,2.00,'',0,24),
	(24,'Claymore',31,'weapon','sword',4,1.25,'',0,12),
	(25,'Long Bow',61,'weapon','bow',3,2.00,'ARROW',0,8),
	(26,'Dull Dagger',55,'weapon','dagger',1,0.25,'',0,2),
	(27,'Dull Axe',21,'weapon','axe',1,1.00,'',0,4),
	(28,'Rod of Healing',6,'weapon','staff',2,1.00,'PLASMABALL',0,50),
	(29,'Blessed Wand',62,'weapon','staff',4,1.00,'PLASMABALL',0,100),
	(30,'Hatchet',25,'weapon','axe',3,0.80,'',0,6),
	(31,'Zombiefinger',27,'weapon','staff',1,0.30,'ACIDBALL',0,2),
	(32,'Honey',28,'consumable','restorative',5,1.00,'',0,10),
	(33,'Battle Axe',17,'weapon','axe',5,1.00,'',0,10),
	(34,'White Tunic',3,'armor','body',1,1.00,'',0,2),
	(35,'Bloodmail',4,'armor','body',7,1.00,'',0,28),
	(36,'Map',13,'tool','map',0,1.00,'',0,0),
	(37,'Skull Helmet',10,'armor','head',5,1.00,'',0,8),
	(38,'Knight Helmet',3,'armor','head',4,1.00,'',0,6),
	(39,'Viking Helmet',9,'armor','head',3,1.00,'',0,6),
	(40,'Pear',71,'consumable','restorative',3,1.00,'',0,3),
	(41,'Strawberry',72,'consumable','restorative',4,1.00,'',0,3),
	(42,'Physalis',73,'consumable','restorative',3,1.00,'',0,6),
	(43,'Cherry',74,'consumable','restorative',2,1.00,'',0,4),
	(44,'Milk',75,'consumable','restorative',5,1.00,'',0,10),
	(45,'Rock',19,'weapon','bow',1,2.00,'ROCK',0,2),
	(46,'Bandit\'s Bow',61,'weapon','bow',4,0.75,'ARROW',0,20),
	(47,'Bandit\'s Hood',6,'armor','head',3,1.00,'',0,35),
	(48,'Slime Attack',0,'weapon','sword',1,2.00,'',0,2),
	(49,'Dragon\'s Head',11,'armor','head',10,1.00,'',0,40),
	(50,'Castle Key 1',7,'tool','key',1720,1.00,'',0,100),
	(51,'AI: Demon Bunny Attack',0,'weapon','sword',1,0.25,'',0,2),
	(52,'Castle Key 2',7,'tool','key',1601,1.00,'',0,100),
	(53,'Ironbane\'s Chamber Key',77,'tool','key',1719,1.00,'',0,100),
	(54,'Double Axe',22,'weapon','axe',7,1.50,'',0,16),
	(55,'Superior Sword',32,'weapon','sword',5,0.50,'',0,12),
	(56,'AI: Slow Slime Attack',0,'weapon','staff',1,2.50,'SLIMEBALL',0,2),
	(57,'AI: Light Bash',0,'weapon','sword',1,1.50,'',0,2),
	(58,'AI: Medium Bash',0,'weapon','staff',2,2.00,'',0,4),
	(59,'Spellbook',8,'tool','book',4,1.00,'',0,8),
	(60,'Castle Gate Key',76,'tool','key',4,1.00,'',0,8),
	(61,'AI: Snuffles, the Destructor\'s',0,'weapon','sword',4,0.25,'',0,8),
	(62,'AI: Black Rabbit',0,'weapon','sword',2,0.50,'',0,4),
	(63,'Bass',20,'tool','restorative',3,1.00,'',0,6),
	(64,'Thiefdagger',64,'weapon','dagger',2,0.25,'',0,4),
	(65,'Kingsword',65,'weapon','sword',7,1.50,'',0,20),
	(66,'Applehead',18,'armor','head',15,1.00,'',0,30),
	(67,'Wings',5,'armor','body',2,1.00,'',0,12),
	(68,'Shadowknight Sword',33,'weapon','sword',8,1.00,'',0,16),
	(69,'Dragon Boots',13,'armor','feet',8,1.00,'',0,36),
	(70,'Mithril Boots',15,'armor','feet',7,1.00,'',0,20),
	(71,'Cheese',130,'consumable','restorative',1,1.00,'',0,2),
	(72,'Nobleman Sword',131,'weapon','sword',6,0.50,'',0,6),
	(73,'Spellbook',132,'weapon','staff',5,1.00,'FIREBALL',0,10),
	(74,'White Whine',133,'consumable','restorative',1,1.00,'',0,2),
	(75,'Blue Crystal',134,'tool','',2,1.00,'',0,4),
	(76,'Red Crystal',135,'tool','',4,1.00,'',0,8),
	(77,'Red Crystal Lode',136,'tool','',6,1.00,'',0,12),
	(78,'Moneybag',137,'cash','',5,1.00,'',0,10),
	(79,'Mithril Helmet',17,'armor','head',7,1.00,'',0,12),
	(80,'Mithril Armor',16,'armor','body',6,1.00,'',0,28),
	(81,'Blackthorn Helmet',21,'armor','head',6,1.00,'',0,14),
	(82,'Blackthorn Armor',19,'armor','body',5,1.00,'',0,32),
	(83,'Blackthorn Leggings',20,'armor','feet',12,1.00,'',0,24),
	(86,'Teddybear',87,'tool','',0,1.00,'',0,1),
	(84,'AI: Fireball Turret',0,'weapon','staff',2,1.50,'FIREBALL',0,0),
	(85,'AI: Flameball Turret',0,'weapon','staff',2,0.30,'FIREBALL',0,0),
	(87,'Chainmail',82,'armor','body',3,1.00,'',0,0),
	(88,'Sapphire Armor',83,'armor','body',8,1.00,'',0,0),
	(89,'Moneybag',137,'cash','',1,1.00,'',0,1),
	(90,'Moneybag',137,'cash','',1,1.00,'',0,5),
	(91,'Torrent Staff',141,'weapon','staff',8,1.00,'PLASMABALL',0,19),
	(92,'Gladiator Sword',140,'weapon','sword',4,0.90,'',0,10);

/*!40000 ALTER TABLE `ib_item_templates` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table ib_items
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ib_items`;

CREATE TABLE `ib_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `template` int(10) unsigned NOT NULL DEFAULT '0',
  `attr1` smallint(4) NOT NULL DEFAULT '0',
  `owner` int(10) NOT NULL DEFAULT '0',
  `equipped` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `slot` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `value` int(10) unsigned NOT NULL DEFAULT '0',
  `data` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table ib_meshes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ib_meshes`;

CREATE TABLE `ib_meshes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `category` varchar(50) NOT NULL DEFAULT 'Unsorted' COMMENT 'Provide a name where this model will belong to. This is to prevent the editor from becoming a big mess of unsorted models.',
  `filename` varchar(50) NOT NULL COMMENT '.Obj file format',
  `scale` float(4,2) unsigned NOT NULL DEFAULT '1.00',
  `transparent` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT 'Does this model use transparent textures? Fill 1 or 0',
  `t1` varchar(50) NOT NULL DEFAULT 'tiles/1' COMMENT 'Tile 1|imgtexturepreview',
  `ts1` float(4,2) NOT NULL DEFAULT '1.00' COMMENT 'Tile Scaling Multiplier 1',
  `t2` varchar(50) NOT NULL DEFAULT 'tiles/1' COMMENT 'Tile 2|imgtexturepreview',
  `ts2` float(4,2) NOT NULL DEFAULT '1.00' COMMENT 'Tile Scaling Multiplier 2',
  `t3` varchar(50) NOT NULL DEFAULT 'tiles/1' COMMENT 'Tile 3|imgtexturepreview',
  `ts3` float(4,2) NOT NULL DEFAULT '1.00' COMMENT 'Tile Scaling Multiplier 3',
  `t4` varchar(50) NOT NULL DEFAULT 'tiles/1' COMMENT 'Tile 4|imgtexturepreview',
  `ts4` float(4,2) NOT NULL DEFAULT '1.00' COMMENT 'Tile Scaling Multiplier 4',
  `t5` varchar(50) NOT NULL DEFAULT 'tiles/1' COMMENT 'Tile 5|imgtexturepreview',
  `ts5` float(4,2) NOT NULL DEFAULT '1.00' COMMENT 'Tile Scaling Multiplier 5',
  `t6` varchar(50) NOT NULL DEFAULT 'tiles/1' COMMENT 'Tile 6|imgtexturepreview',
  `ts6` float(4,2) NOT NULL DEFAULT '1.00' COMMENT 'Tile Scaling Multiplier 6',
  `t7` varchar(50) NOT NULL DEFAULT 'tiles/1' COMMENT 'Tile 7|imgtexturepreview',
  `ts7` float(4,2) NOT NULL DEFAULT '1.00' COMMENT 'Tile Scaling Multiplier 7',
  `t8` varchar(50) NOT NULL DEFAULT 'tiles/1' COMMENT 'Tile 8|imgtexturepreview',
  `ts8` float(4,2) NOT NULL DEFAULT '1.00' COMMENT 'Tile Scaling Multiplier 8',
  `special` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT 'Whether this model uses special things, such as particles (e.g. Lantern)',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `ib_meshes` WRITE;
/*!40000 ALTER TABLE `ib_meshes` DISABLE KEYS */;

INSERT INTO `ib_meshes` (`id`, `name`, `category`, `filename`, `scale`, `transparent`, `t1`, `ts1`, `t2`, `ts2`, `t3`, `ts3`, `t4`, `ts4`, `t5`, `ts5`, `t6`, `ts6`, `t7`, `ts7`, `t8`, `ts8`, `special`)
VALUES
	(1,'Fortress Wall Gate','Building','wallgate.obj',1.00,0,'tiles/35',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(2,'RIP Stone','Decoration','ripstone.obj',0.15,0,'tiles/34',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(3,'Well','Building','well.obj',1.50,0,'tiles/2',5.00,'tiles/1',0.30,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(4,'Tree1','Foliage','tree.obj',1.00,0,'tiles/99',1.00,'tiles/32',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(5,'Tree2','Foliage','tree2.obj',1.00,0,'tiles/12',1.00,'tiles/99',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(6,'Pinetree','Foliage','pinetree.obj',1.00,0,'tiles/31',0.50,'tiles/99',3.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(11,'Wooden Fence','Fence','fence.obj',1.00,1,'textures/fence',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(7,'Runestone','Decoration','rune.obj',1.00,0,'textures/rune',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(18,'Blacksmith','Building','blacksmith.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(10,'bookshelf','Decoration','bookshelf.obj',1.00,0,'textures/bookshelf',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(19,'House 1','Building','house1.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/15',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(43,'Square Grave','Decoration','squaregrave.obj',1.00,0,'textures/squaregrave1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(13,'Chest','Interactive','chest.obj',1.00,0,'textures/chest',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(14,'Normal Sign','Decoration','sign_normal.obj',1.00,0,'textures/sign_normal',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(15,'Huge Sign','Decoration','sign_huge.obj',1.00,0,'textures/sign_huge',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(16,'Direction Sign','Decoration','sign_direction.obj',1.00,0,'tiles/13',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(17,'Lever 1','Interactive','lever1.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(9,'Inn 1','Building','inn1.obj',1.00,0,'tiles/47',0.10,'tiles/1',0.10,'tiles/1',1.00,'tiles/9',1.00,'tiles/1',1.00,'tiles/15',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(8,'Grave Cross','Decoration','cross.obj',1.00,0,'tiles/34',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(20,'Town Hall','Building','townhall.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/15',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(21,'Blacksmith','Building','blacksmith.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(22,'Shack','Building','shack.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/15',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(23,'House 2','Building','house2.obj',1.00,0,'tiles/1',1.00,'tiles/15',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(24,'House 2 With Basement','Building','house2_basement.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(25,'Terrain (Used for skybox)','Misc','terrain.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(26,'Iron Fence Long','Fence','ifence.obj',1.00,1,'textures/hironfence2',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(27,'Iron Fence Short','Fence','ironfenceshort.obj',1.00,1,'textures/hironfencesmall',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(28,'Bridge','Building','bridge.obj',1.00,0,'tiles/1',0.50,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(29,'Rock','Misc','rock.obj',1.00,0,'tiles/34',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(30,'Flatrock','Decoration','flatrock.obj',1.00,0,'tiles/34',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(31,'Lantern 1','Decoration','lantern.obj',1.00,0,'tiles/1',1.00,'tiles/2',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,1),
	(32,'Wall 4x4x1','Construction','wall_4_4_1.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(33,'Wall 8x8x1','Construction','wall_8_8_1.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(34,'Chair','Decoration','chair.obj',1.00,0,'tiles/15',1.00,'tiles/15',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(35,'Crate','Decoration','crate.obj',1.00,0,'tiles/25',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(36,'Table','Decoration','table.obj',1.00,0,'tiles/9',1.00,'tiles/9',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(37,'Anvil','Decoration','anvil.obj',1.00,0,'tiles/34',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(38,'Barrel','Decoration','barrel.obj',1.00,0,'tiles/26',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(39,'Block 4x4x2','Construction','block_4_4_2.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(40,'Block 4x4x1','Construction','block_4_4_1.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(42,'Dead Tree','Foilage','deadtree.obj',2.00,0,'tiles/99',0.10,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(44,'Fortress Wall','Building','wall.obj',1.00,0,'tiles/35',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(46,'Fortress Wall Tower','Building','tower.obj',1.00,0,'tiles/35',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(47,'Fortress Wall Tower (turn)','Building','tower2.obj',1.00,0,'tiles/35',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(48,'Fortress Wall Tower (room)','Building','tower3.obj',1.00,0,'tiles/35',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(49,'Portcullis','Building','portcullis.obj',1.00,1,'textures/portcullis',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(50,'Skullpile','Decoration','haypile2.obj',0.30,0,'textures/skullpile',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(51,'Haypile','Decoration','haypile.obj',0.50,0,'tiles/92',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(52,'Ironbane\'s Castle (unfinished, no touchy)','Building','ibcastle.obj',2.00,0,'tiles/35',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(53,'Beam Short','Construction','block_thin_short.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(56,'Wall 16x4x1','Construction','wall_16_4_1.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(54,'Wall 16x8x1','Construction','wall_16_8_1.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(55,'Wall 16x16x1','Construction','wall_16_16_1.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(57,'Wall 8x4x1','Construction','wall_8_4_1.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(58,'Wall 4x1x1','Construction','wall_4_1_1.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(59,'Wall 8x1x1','Construction','wall_8_1_1.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(60,'Wall 16x1x1','Construction','wall_16_1_1.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(61,'Wall 32x16x1','Construction','wall_32_16_1.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(62,'Wall 32x32x1','Construction','wall_32_32_1.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(63,'Painting 2x1','Decoration','painting_2x1.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(64,'Painting 4x3','Decoration','painting_4x3.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(65,'Slime shooter','Misc','lantern.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(66,'Slope 4x2x4','Construction','slope_4_2_4.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(67,'Slope 8x2x4','Construction','slope_8_2_4.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(68,'Slope 8x4x4','Construction','slope_8_4_4.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(69,'Door 4x4x1','Construction','door_4_4_1.obj',1.00,0,'textures/door',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(70,'Door 8x8x1','Construction','door_8_8_1.obj',1.00,0,'textures/door',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(71,'Catacombs Entrance','Quests','crypt.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(72,'Church','Building','church.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(74,'Warrior Statue','Decoration','warrior_statue.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),
	(75,'Cube','Misc','regularcube.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0);

/*!40000 ALTER TABLE `ib_meshes` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table ib_unit_templates
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ib_unit_templates`;

CREATE TABLE `ib_unit_templates` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Leave blank to auto-generate.',
  `prefix` varchar(20) DEFAULT 'a' COMMENT 'Can be "a", "an" or "the" (or something else?)',
  `name` varchar(50) DEFAULT NULL,
  `type` tinyint(3) DEFAULT NULL COMMENT 'A number representing this NPC''s type.<br><br>Can be one of the following values:<br>Regular NPC:1<br>MONSTER:20<br>VENDOR:21<br>TURRET:22',
  `skin` smallint(4) unsigned NOT NULL COMMENT 'The skin ID this NPC will use. See Uploads: Skin|imgskinpreview',
  `eyes` smallint(4) unsigned NOT NULL COMMENT 'The eyes ID this NPC will use. See Uploads: Eyes|imgeyespreview',
  `hair` smallint(4) unsigned NOT NULL COMMENT 'The hair ID this NPC will use. See Uploads: Hair|imghairpreview',
  `feet` smallint(4) unsigned NOT NULL COMMENT 'The feet ID this NPC will use. See Uploads: Feet Equipment|imgfeetpreview',
  `body` smallint(4) unsigned NOT NULL COMMENT 'The body ID this NPC will use. See Uploads: Body Equipment|imgbodypreview',
  `head` smallint(4) unsigned NOT NULL COMMENT 'The head ID this NPC will use. See Uploads: Head Equipment|imgheadpreview',
  `friendly` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT 'Can be 1 or 0.',
  `health` smallint(4) unsigned NOT NULL DEFAULT '1' COMMENT 'Health this NPC will spawn with',
  `armor` smallint(4) unsigned NOT NULL COMMENT 'Armor this NPC will spawn with',
  `weapons` varchar(255) NOT NULL COMMENT 'A list of item template IDs which this NPC will be able to use in battle.',
  `aimerror` tinyint(1) unsigned NOT NULL DEFAULT '3' COMMENT 'The distance this NPC will aim badly when using projectile attacks. Use 0 for a perfect aim.',
  `loot` varchar(255) NOT NULL COMMENT 'The loot this NPC may drop on death. Uses following format:<br><br><b><i>&#60;chance in 100&#62;:&#60;itemID&#62;[;&#60;chance in 100&#62;;&#60;itemID&#62;]...</i></b><br><br>For example: <i>100:3;25:1034;12:3923</i><br><br><b>Note: for Vendors, ONLY ente',
  `respawntime` smallint(4) unsigned NOT NULL DEFAULT '30' COMMENT 'Amount of seconds before this NPC can respawn after death',
  `displayweapon` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT 'Set to 1 if you want the weapon of this NPC to be visible at all times. Set to 0 for special weapons (e.g. bone thrower)',
  `size` float(4,2) unsigned NOT NULL DEFAULT '1.00' COMMENT 'A size multiplier for this NPC in-game. Only use for special mobs that must appear bigger.',
  `aggroradius` tinyint(2) unsigned NOT NULL DEFAULT '10' COMMENT 'The distance a player can go nearby without the NPC going aggressive.',
  `spawnguardradius` smallint(4) unsigned NOT NULL DEFAULT '10' COMMENT 'The distance this NPC can walk away from his spawning point without returning',
  `special` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT 'Whether this NPC is a special NPC and should not be placeable using the in-game editor.',
  `param` smallint(4) unsigned NOT NULL DEFAULT '0' COMMENT 'UNUSED',
  `disabled` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT 'UNUSED',
  `weaponoffsetmultiplier` float(4,2) DEFAULT '1.00',
  `usebashattack` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT 'Whether this unit "bashes" into the enemy instead of throwing their weapon at the target. 0 or 1',
  `invisible` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '1 or 0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `ib_unit_templates` WRITE;
/*!40000 ALTER TABLE `ib_unit_templates` DISABLE KEYS */;

INSERT INTO `ib_unit_templates` (`id`, `prefix`, `name`, `type`, `skin`, `eyes`, `hair`, `feet`, `body`, `head`, `friendly`, `health`, `armor`, `weapons`, `aimerror`, `loot`, `respawntime`, `displayweapon`, `size`, `aggroradius`, `spawnguardradius`, `special`, `param`, `disabled`, `weaponoffsetmultiplier`, `usebashattack`, `invisible`)
VALUES
	(1,'an','Acid Zombie',20,10,0,0,0,0,0,0,10,10,'9',2,'5:9;15:6;50:78',200,0,1.00,30,30,0,0,0,1.00,0,0),
	(2,'a','Loot Bag',2,0,0,0,0,0,0,0,0,0,'',3,'',30,1,1.00,0,0,1,0,0,1.00,0,0),
	(3,'a','Vendor',21,1001,1000,1000,1,1,1,1,10,10,'1',3,'1;27;26;8;29;16;16;',30,1,1.00,0,10,0,0,0,1.00,0,0),
	(4,'a','Moving Obstacle',6,0,0,0,0,0,0,0,1,0,'',3,'',30,1,1.00,10,10,1,0,0,1.00,0,0),
	(5,'a','Toggleable Obstacle',8,0,0,0,0,0,0,0,1,0,'',3,'',30,1,1.00,10,10,1,0,0,1.00,0,0),
	(6,'a','Lever',9,0,0,0,0,0,0,0,1,0,'',3,'',30,1,1.00,10,10,1,0,0,1.00,0,0),
	(7,'a','Teleport Entrance',10,0,0,0,0,0,0,0,1,0,'',3,'',30,1,1.00,10,10,1,0,0,1.00,0,0),
	(8,'a','Teleport Exit',11,0,0,0,0,0,0,0,1,0,'',3,'',30,1,1.00,10,10,1,0,0,1.00,0,0),
	(9,'a','Sign',12,0,0,0,0,0,0,0,1,0,'',3,'',30,1,1.00,10,10,1,0,0,1.00,0,0),
	(30,'a','Skeleton',20,11,0,0,0,0,0,0,6,4,'12',3,'20:22;45:89',200,0,1.00,10,30,0,0,0,1.00,0,0),
	(10,'a','Lootable Mesh',2,0,0,0,0,0,0,0,1,0,'',3,'',30,1,1.00,0,0,1,0,0,1.00,0,0),
	(31,'a','Bone Turret',24,11,0,0,0,0,0,0,1,100,'12',3,'',30,1,1.00,10,10,0,0,0,1.00,0,0),
	(11,'a','Heart Piece',13,0,0,0,0,0,0,0,1,0,'',3,'',30,1,1.00,10,10,1,0,0,1.00,0,0),
	(32,'a','Ghost',20,24,0,0,0,0,0,0,15,5,'21',3,'20:16;15:26;10:27;1:35;15:34;',60,0,1.00,30,30,0,0,0,1.00,0,0),
	(38,'a','Green Slime',20,1020,0,0,0,0,0,0,4,0,'48',2,'30:15;10:1;5:5;5:27;1:24;1:6',30,0,1.00,20,20,0,0,0,1.00,1,0),
	(66,'The','Ugarth the Ugly',20,11,0,0,2,2,2,0,30,20,'30',3,'100:16;100:1;20:19;15:18;5:10;30:8;1:35;5:24;10:26;16:20;30:28;',2000,1,3.00,15,15,0,0,0,0.00,0,0),
	(40,'','Bernard',21,1003,1000,1000,1,1,0,1,8,3,'',3,'13;14;15',30,0,1.00,10,10,0,0,0,1.00,0,0),
	(41,'a','Bandit',20,1001,1000,1,1,1,1,0,8,3,'1',3,'15:7;30:1;10:6;13:5;35:15;5:28;10:90',120,1,1.00,10,40,0,0,0,1.00,0,0),
	(42,'a','Bowman',20,1001,1000,0,1,1,1,0,10,2,'8',5,'15:7;10:8;10:6;13:5;35:15',240,1,1.00,10,40,0,0,0,1.00,0,0),
	(45,'The','Viking Slime Boss',20,1031,0,0,0,0,0,0,30,15,'1',3,'20:78;5:33',2000,1,2.00,10,10,0,0,0,4.00,0,0),
	(44,'a','Viking Slime',20,1024,0,0,0,0,0,0,3,5,'27',3,'5:90;5:27',120,1,1.00,10,10,0,0,0,1.00,1,0),
	(46,'a','Goblin',20,1030,0,0,0,0,0,0,2,2,'45',5,'20:89;5:26',30,1,1.00,20,20,0,0,0,1.00,0,0),
	(47,'','William',21,1001,1000,1001,1,1,1,1,20,15,'1',3,'1;5;6;7;18;19;20',30,1,1.00,10,10,0,0,0,1.00,0,0),
	(48,'','Mari-Ann',21,1011,1018,1014,1,1,0,1,2,0,'',3,'100:1;100:15;100:15;100:8;100:26',30,1,1.00,10,10,0,0,0,1.00,0,0),
	(72,'Mrs.','Erma',21,1011,1018,1010,1,3,0,1,10,20,'',3,'16;16;16;28;29;59',30,1,1.00,10,10,0,0,0,1.00,0,0),
	(52,'a','Purple Slime',20,1025,0,0,0,0,0,0,5,0,'8',10,'25:8',60,1,1.00,15,8,0,0,0,1.00,0,0),
	(55,'The','Alabaster King',20,11,0,0,0,0,0,0,30,30,'23',0,'100:23;29:29;50:15;75:16;10:30;1:35;',3600,1,3.00,20,20,0,0,0,0.00,0,0),
	(65,'The','Bandit Leader',20,1001,1002,1000,1,0,6,0,30,25,'46',3,'30:46;40:47;20:45;25:27;40:26;50:78',1600,1,3.00,15,15,0,0,0,3.00,0,0),
	(57,'a','Wraith',20,28,0,0,0,0,0,0,15,5,'21',1,'',100,0,1.20,12,12,0,0,0,0.00,0,0),
	(58,'The','Specter',20,28,0,0,0,0,0,0,25,10,'21',0,'',1600,0,3.00,20,20,0,0,0,0.00,0,0),
	(59,'a','Demon Bunny',20,29,0,0,0,0,0,0,3,1,'51',1,'15:24;25:1;15:27;10:45;50:40;1:70',30,0,1.00,10,10,0,0,0,0.00,1,0),
	(60,'a','Red Bones',20,30,0,0,0,0,0,0,12,8,'12',3,'10:29;15:38;10:35;',60,0,1.50,15,15,0,0,0,0.00,0,0),
	(61,'a','Knight Statue',20,1000,0,0,2,2,2,0,1,20,'1',3,'',120,1,1.00,1,30,0,0,0,0.00,0,0),
	(62,'The','Knight Lord',20,1000,0,0,2,2,3,0,1,30,'54',3,'',200,1,3.00,20,20,0,0,0,0.00,0,0),
	(68,'a','Tutorial Slime Shooter',24,0,0,0,0,0,0,0,1,1,'56',3,'',120,0,1.00,20,20,0,0,0,0.00,0,0),
	(69,'a','Rat Boss',20,32,0,0,0,0,0,0,3,5,'58',3,'40:14',120,0,2.00,10,20,0,0,0,1.00,1,0),
	(70,'a','Rat',20,27,0,0,0,0,0,0,1,0,'57',3,'80:71;10:89',30,0,1.00,10,20,0,0,0,1.00,1,0),
	(71,'a','Music Player',14,0,0,0,0,0,0,0,1,0,'',3,'',30,1,1.00,10,10,1,0,0,1.00,0,0),
	(73,'','Snuffles, the Destructor',20,33,0,0,0,0,0,0,30,10,'61',3,'',1000,0,3.00,60,100,0,0,0,1.00,1,0),
	(74,'a','Black Rabbit',20,33,0,0,0,0,0,0,10,2,'62',3,'5:70;8:68',50,0,1.20,30,30,0,0,0,1.00,1,0),
	(75,'','John',1,1002,1000,1001,1,1,0,1,10,10,'1',3,'',30,1,1.00,10,10,0,0,0,1.00,0,0),
	(76,'','Leslie',21,1001,1006,0,2,0,0,1,20,10,'24',3,'24;63',30,1,1.50,10,10,0,0,0,1.00,0,0),
	(77,'a','Zombie',20,34,0,0,0,0,0,0,7,0,'',3,'1:35;10:6;12:5;8:7',60,1,1.00,5,5,0,0,0,1.00,0,0),
	(78,'a','Zombie Knight',20,34,0,0,2,2,3,0,25,25,'68',1,'4:35;10:19;12:20;8:38;4:68',60,1,3.00,5,5,0,0,0,1.00,0,0),
	(79,'a','Zombie Soldier',20,34,0,0,1,1,2,0,10,10,'',3,'1:35;20:6;22:5;18:7',60,1,2.00,5,5,0,0,0,1.00,0,0),
	(80,'a','Shadow Zombie',20,34,0,0,0,0,0,0,50,50,'68',3,'20:83;12:82;15:81;40:68',120,1,4.00,10,5,0,0,0,1.00,0,0),
	(81,'Mr.','Bob Loblaw',21,1002,1000,1001,1,1,0,1,20,5,'1',3,'15;15;41;16;16;15;15;',120,1,1.00,5,5,0,0,0,1.00,0,0),
	(84,'a','Topaz Slime',20,41,0,0,0,0,0,0,5,10,'48',3,'',3600,0,1.50,10,10,0,0,0,1.00,1,0),
	(82,'a','Sapphire Slime',20,40,0,0,0,0,0,0,10,20,'48',3,'',3600,0,2.00,10,10,0,0,0,1.00,1,0),
	(85,'a','Amethyst Slime',20,42,0,0,0,0,0,0,5,5,'48',3,'',3600,0,1.00,10,10,0,0,0,1.00,1,0),
	(86,'a','Garnet Slime',20,43,0,0,0,0,0,0,10,5,'48',3,'',3600,0,2.00,10,10,0,0,0,1.00,1,0),
	(87,'a','Golden Slime',20,44,0,0,0,0,0,0,20,30,'48',3,'',3600,0,1.00,10,10,0,0,0,1.00,1,0),
	(88,'a','Ironbane',20,1100,0,0,0,0,0,0,100,300,'85',5,'',10,0,20.00,30,10,0,0,0,1.00,0,0),
	(89,'a','Fireball Turret',24,0,0,0,0,0,0,0,1,1,'84',3,'',120,0,1.00,20,20,0,0,0,0.00,0,0),
	(90,'a','Arnold T. Blunt',21,1002,1000,1001,1,1,0,1,20,5,'1',3,'1;1;1;1;1;1;1;1;1;1',30,1,1.00,10,10,0,0,0,1.00,0,0),
	(91,'a','Flameball Turret',24,0,0,0,0,0,0,0,1,1,'85',3,'',120,0,1.00,20,20,0,0,0,0.00,0,0),
	(92,'a','Hornet',20,37,0,0,0,0,0,0,5,0,'57',3,'',30,0,1.00,10,10,0,0,0,1.00,1,0),
	(93,'a','Bat',20,35,0,0,0,0,0,0,3,1,'57',3,'15:89',30,0,1.00,10,10,0,0,0,1.00,1,0),
	(94,'a','Horseshoe Bat',20,26,0,0,0,0,0,0,8,3,'58',3,'',30,0,1.00,10,10,0,0,0,1.00,1,0);

/*!40000 ALTER TABLE `ib_unit_templates` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table ib_units
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ib_units`;

CREATE TABLE `ib_units` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `x` int(10) NOT NULL,
  `y` int(10) NOT NULL,
  `z` int(10) NOT NULL,
  `zone` smallint(4) unsigned NOT NULL,
  `template` int(10) unsigned NOT NULL,
  `roty` smallint(3) DEFAULT '0',
  `param` int(10) NOT NULL DEFAULT '0',
  `data` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `ib_units` WRITE;
/*!40000 ALTER TABLE `ib_units` DISABLE KEYS */;

INSERT INTO `ib_units` (`id`, `x`, `y`, `z`, `zone`, `template`, `roty`, `param`, `data`)
VALUES
	(3,-879,0,515,1,9,NULL,2,'{\"text\":\"RIP - Quistardia Fisherman Family\",\"fontSize\":10,\"rotY\":329}'),
	(18,123,19,84,4,60,75,0,'null'),
	(14,132,19,69,4,5,NULL,40,'{\"movementType\":2,\"speedMultiplier\":10,\"distanceMultiplier\":23,\"rotY\":88,\"startOpen\":false}'),
	(15,139,19,96,4,6,NULL,0,'{\"switchNumber\":14}'),
	(19,128,19,95,4,61,326,0,'null'),
	(20,129,19,103,4,61,227,0,'null'),
	(21,119,19,104,4,61,103,0,'null'),
	(22,120,19,95,4,61,75,0,'null'),
	(23,124,19,100,4,61,38,0,'null'),
	(25,129,19,88,4,60,85,0,'null'),
	(459,183,1,141,4,5,NULL,40,'{\"movementType\":2,\"speedMultiplier\":5,\"distanceMultiplier\":17,\"rotY\":89,\"startOpen\":false}'),
	(29,134,42,58,4,6,NULL,0,'{\"switchNumber\":14}'),
	(30,5,2,41,1,40,76,0,'null'),
	(31,20,2,84,1,47,356,0,'null'),
	(32,-75,0,152,1,38,215,0,'null'),
	(33,-71,0,150,1,38,213,0,'null'),
	(34,-62,0,152,1,38,208,0,'null'),
	(35,-76,0,158,1,38,163,0,'null'),
	(36,-81,1,142,1,38,146,0,'null'),
	(37,-102,0,151,1,38,228,0,'null'),
	(38,-91,0,173,1,38,277,0,'null'),
	(39,-94,0,180,1,38,238,0,'null'),
	(40,-98,0,191,1,38,258,0,'null'),
	(41,-96,0,225,1,38,74,0,'null'),
	(42,-104,0,241,1,38,173,0,'null'),
	(50,-159,1,27,1,41,81,0,'null'),
	(51,-157,2,25,1,41,141,0,'null'),
	(58,-173,1,52,1,42,169,0,'null'),
	(57,-170,1,46,1,41,256,0,'null'),
	(59,-178,2,54,1,42,156,0,'null'),
	(60,-77,9,55,1,70,24,0,'null'),
	(61,-77,9,55,1,70,24,0,'null'),
	(62,-77,9,55,1,70,24,0,'null'),
	(63,-77,9,55,1,70,24,0,'null'),
	(64,-155,0,64,1,41,238,0,'null'),
	(65,-154,0,73,1,41,295,0,'null'),
	(66,-141,2,72,1,41,25,0,'null'),
	(67,-135,1,106,1,1,267,0,'null'),
	(68,-135,1,107,1,38,307,0,'null'),
	(69,-134,2,92,1,38,97,0,'null'),
	(70,-126,5,75,1,38,19,0,'null'),
	(71,-197,4,213,1,44,167,0,'null'),
	(72,-196,5,202,1,44,56,0,'null'),
	(73,-202,4,221,1,44,259,0,'null'),
	(74,-198,4,214,1,38,99,0,'null'),
	(75,-191,5,205,1,38,339,0,'null'),
	(76,-180,4,208,1,38,320,0,'null'),
	(77,-161,25,-125,1,32,56,0,'null'),
	(78,-161,25,-125,1,32,56,0,'null'),
	(440,-252,0,-102,1,41,308,0,'null'),
	(439,-249,0,-101,1,41,230,0,'null'),
	(438,-247,-1,-103,1,41,253,0,'null'),
	(441,-252,0,-103,1,42,29,0,'null'),
	(107,-230,2,-168,1,52,193,0,'null'),
	(108,-230,2,-168,1,38,193,0,'null'),
	(88,-1379,17,409,1,32,75,0,'null'),
	(89,-1414,2,354,1,30,265,0,'null'),
	(90,-1432,2,370,1,30,322,0,'null'),
	(91,-1423,4,382,1,57,125,0,'null'),
	(92,-1426,15,427,1,57,42,0,'null'),
	(93,-879,0,520,1,32,335,0,'null'),
	(94,-879,0,520,1,32,335,0,'null'),
	(95,-879,0,520,1,32,335,0,'null'),
	(96,-969,13,526,1,57,154,0,'null'),
	(97,-401,1,-43,1,46,184,0,'null'),
	(98,-401,1,-43,1,46,184,0,'null'),
	(99,-401,1,-43,1,46,184,0,'null'),
	(100,-1803,356,-62,1,9,NULL,3,'{\"text\":\"lol how did you get up here? ;)\",\"fontSize\":20,\"rotY\":79}'),
	(823,1,10,176,7,8,NULL,0,'{\"invisible\":true}'),
	(102,-349,1,-67,1,81,287,0,'null'),
	(109,-230,2,-168,1,38,193,0,'null'),
	(105,-351,1,-66,1,9,NULL,2,'{\"text\":\"Bob Loblaw\'s Fruit\",\"fontSize\":16,\"rotY\":195}'),
	(110,-230,2,-168,1,38,193,0,'null'),
	(111,-230,2,-168,1,38,193,0,'null'),
	(112,-230,2,-168,1,38,193,0,'null'),
	(113,-230,2,-168,1,38,193,0,'null'),
	(114,-230,2,-168,1,38,193,0,'null'),
	(115,-230,2,-168,1,38,193,0,'null'),
	(116,-230,2,-168,1,38,193,0,'null'),
	(117,-230,2,-168,1,38,193,0,'null'),
	(118,75,40,-163,1,44,105,0,'null'),
	(119,75,40,-163,1,38,105,0,'null'),
	(120,75,40,-163,1,38,105,0,'null'),
	(121,75,40,-163,1,38,105,0,'null'),
	(122,75,40,-163,1,38,105,0,'null'),
	(123,75,40,-163,1,38,105,0,'null'),
	(124,75,40,-163,1,38,105,0,'null'),
	(125,75,40,-163,1,52,105,0,'null'),
	(835,-711,32,206,1,4,NULL,40,'{\"movementType\":2,\"speedMultiplier\":1,\"distanceMultiplier\":4,\"rotY\":271}'),
	(822,-974,8,500,1,38,201,0,'null'),
	(131,-1400,27,-55,1,30,324,0,'null'),
	(838,-717,36,207,1,4,NULL,53,'{\"movementType\":3,\"speedMultiplier\":0.5,\"distanceMultiplier\":3,\"rotY\":180}'),
	(815,-958,6,507,1,30,73,0,'null'),
	(825,-268,76,68,6,10,NULL,13,'{\"loot\":\"100:29\",\"respawnTime\":2000,\"rotY\":181}'),
	(824,2,25,17,4,7,NULL,0,'{\"targetExit\":823,\"invisible\":false}'),
	(828,1,10,-45,7,88,88,0,'null'),
	(895,-711,43,204,1,4,NULL,40,'{\"movementType\":3,\"speedMultiplier\":0.5,\"distanceMultiplier\":2,\"rotY\":271}'),
	(829,-449,3,1271,1,9,NULL,2,'{\"text\":\"Beware the magic Naruto Symbol\",\"fontSize\":10,\"rotY\":242}'),
	(816,-953,5,501,1,30,10,0,'null'),
	(817,-950,6,515,1,30,295,0,'null'),
	(818,-942,5,522,1,30,357,0,'null'),
	(819,-930,4,523,1,38,30,0,'null'),
	(820,-929,2,510,1,38,140,0,'null'),
	(821,-943,4,507,1,38,174,0,'null'),
	(189,5,60,13,3,4,NULL,40,'{\"movementType\":2,\"speedMultiplier\":1,\"distanceMultiplier\":4.2,\"rotY\":180}'),
	(170,-188,5,53,3,4,NULL,40,'{\"movementType\":2,\"speedMultiplier\":1,\"distanceMultiplier\":4.3,\"rotY\":182}'),
	(173,45,56,44,3,9,NULL,2,'{\"text\":\"W, A, S, D | to move\",\"fontSize\":20,\"rotY\":0}'),
	(175,48,56,21,3,9,NULL,2,'{\"text\":\"SPACEBAR | to jump\",\"fontSize\":20,\"rotY\":0}'),
	(346,-12,65,12,3,9,NULL,3,'{\"text\":\"Equip your sword|by clicking on it.||You can also press|the numeric keys.||\",\"fontSize\":20,\"rotY\":90}'),
	(179,18,56,7,3,9,NULL,3,'{\"text\":\"Stand near the chest.||Drag and drop a sword to|your inventory bar at the bottom.\",\"fontSize\":20,\"rotY\":359}'),
	(349,-3,43,37,3,9,NULL,1,'{\"text\":\"Kill the rats!\",\"fontSize\":20,\"rotY\":179}'),
	(340,5,56,18,3,9,NULL,1,'{\"text\":\"Jump on|the platform\",\"fontSize\":20,\"rotY\":270}'),
	(341,5,56,9,3,9,NULL,1,'{\"text\":\"Jump on|the platform\",\"fontSize\":20,\"rotY\":90}'),
	(348,-2,43,21,3,9,NULL,3,'{\"text\":\"Equip your sword and|press the left mouse button| to attack.||\",\"fontSize\":20,\"rotY\":270}'),
	(192,10,43,34,3,70,22,0,'null'),
	(193,14,43,37,3,70,334,0,'null'),
	(194,19,43,30,3,70,113,0,'null'),
	(195,-3,43,54,3,9,NULL,2,'{\"text\":\"Fall down!|It won\'t hurt!| ... much.\",\"fontSize\":17,\"rotY\":270}'),
	(198,-24,1,56,3,9,NULL,1,'{\"text\":\"This way!\",\"fontSize\":20,\"rotY\":337}'),
	(354,-22,1,46,3,9,NULL,3,'{\"text\":\"? Go left to continue|the tutorial.|| ...or jump the platforms|for something extra! ?||\",\"fontSize\":20,\"rotY\":76}'),
	(269,12,6,41,3,10,NULL,13,'{\"loot\":\"100:7\",\"respawnTime\":60,\"rotY\":359}'),
	(205,17,6,40,3,9,NULL,1,'{\"text\":\"Next | Challenge!\",\"fontSize\":20,\"rotY\":90}'),
	(210,16,5,48,3,4,NULL,40,'{\"movementType\":3,\"speedMultiplier\":1,\"distanceMultiplier\":2,\"rotY\":359}'),
	(212,16,8,55,3,4,NULL,40,'{\"movementType\":2,\"speedMultiplier\":1.5,\"distanceMultiplier\":3,\"rotY\":1}'),
	(213,16,11,60,3,4,NULL,40,'{\"movementType\":1,\"speedMultiplier\":1,\"distanceMultiplier\":3,\"rotY\":0}'),
	(1012,9,11,66,3,4,NULL,40,'{\"movementType\":3,\"speedMultiplier\":0.7,\"distanceMultiplier\":3.7,\"rotY\":271}'),
	(220,3,14,73,3,4,NULL,40,'{\"movementType\":2,\"speedMultiplier\":1,\"distanceMultiplier\":4,\"rotY\":269}'),
	(224,-2,17,74,3,10,NULL,13,'{\"loot\":\"100:6;100:8\",\"respawnTime\":60,\"rotY\":271}'),
	(225,-41,1,43,3,9,NULL,2,'{\"text\":\"Watch out for | slime turrets!\",\"fontSize\":20,\"rotY\":359}'),
	(226,-53,1,47,3,68,360,0,'null'),
	(227,-54,1,51,3,68,360,0,'null'),
	(228,-54,1,55,3,68,360,0,'null'),
	(229,-49,1,70,3,68,89,0,'null'),
	(230,-53,1,70,3,68,89,0,'null'),
	(231,-67,1,66,3,68,360,0,'null'),
	(270,-57,1,58,3,68,90,0,'null'),
	(233,-64,1,48,3,68,270,0,'null'),
	(237,-65,1,46,3,68,133,0,'null'),
	(238,-64,1,43,3,68,134,0,'null'),
	(239,-76,1,56,3,68,88,0,'null'),
	(240,-77,1,62,3,68,358,0,'null'),
	(241,-69,1,60,3,68,180,0,'null'),
	(242,-71,1,70,3,68,91,0,'null'),
	(243,-74,1,70,3,68,88,0,'null'),
	(244,-79,1,69,3,10,NULL,13,'{\"loot\":\"100:5\",\"respawnTime\":60,\"rotY\":90}'),
	(276,-168,1,55,3,70,29,0,'null'),
	(275,-169,1,51,3,70,213,0,'null'),
	(247,-76,1,44,3,70,166,0,'null'),
	(248,-82,1,43,3,70,167,0,'null'),
	(249,-78,1,40,3,70,48,0,'null'),
	(255,-38,3,69,3,10,NULL,13,'{\"loot\":\"100:19\",\"respawnTime\":300,\"rotY\":89}'),
	(274,-164,1,55,3,70,71,0,'null'),
	(273,-168,1,60,3,70,32,0,'null'),
	(277,-163,1,52,3,70,78,0,'null'),
	(267,18,56,8,3,10,NULL,13,'{\"loot\":\"100:1\",\"respawnTime\":10,\"rotY\":181}'),
	(358,-98,0,248,1,38,155,0,'null'),
	(280,323,75,29,1,8,NULL,0,'{\"invisible\":true}'),
	(281,-212,1,36,3,7,NULL,0,'{\"targetExit\":280,\"invisible\":false}'),
	(327,69,23,-115,1,38,137,0,'null'),
	(328,60,23,-117,1,38,210,0,'null'),
	(329,61,21,-112,1,38,297,0,'null'),
	(331,-208,41,241,5,8,NULL,0,'{\"invisible\":true}'),
	(359,-102,0,235,1,38,151,0,'null'),
	(360,-113,0,245,1,52,293,0,'null'),
	(361,-107,0,257,1,52,244,0,'null'),
	(362,-131,2,263,1,38,229,0,'null'),
	(363,-90,0,271,1,44,334,0,'null'),
	(364,-82,0,273,1,38,348,0,'null'),
	(365,-86,0,278,1,52,224,0,'null'),
	(374,-682,2,133,1,1,117,0,'null'),
	(375,-682,2,135,1,1,111,0,'null'),
	(376,2,19,139,4,62,282,0,'null'),
	(377,-1,19,141,4,61,279,0,'null'),
	(378,3,19,144,4,61,36,0,'null'),
	(379,9,19,136,4,61,121,0,'null'),
	(380,4,19,133,4,61,233,0,'null'),
	(381,175,3,208,4,66,27,0,'null'),
	(384,175,3,209,4,60,79,0,'null'),
	(385,176,3,205,4,60,91,0,'null'),
	(387,5,10,204,1,1,280,0,'null'),
	(388,-14,15,224,1,1,64,0,'null'),
	(389,-38,12,225,1,1,200,0,'null'),
	(390,-35,9,202,1,38,299,0,'null'),
	(391,-33,6,191,1,38,342,0,'null'),
	(392,-21,8,197,1,38,347,0,'null'),
	(393,3,6,192,1,38,358,0,'null'),
	(394,100,47,249,1,59,246,0,'null'),
	(395,100,47,249,1,59,246,0,'null'),
	(396,97,44,259,1,59,222,0,'null'),
	(397,96,44,260,1,59,157,0,'null'),
	(398,92,44,253,1,59,50,0,'null'),
	(407,110,42,116,4,62,90,0,'null'),
	(408,112,42,58,4,61,318,0,'null'),
	(409,113,42,62,4,61,266,0,'null'),
	(412,98,42,138,4,4,NULL,40,'{\"movementType\":1,\"speedMultiplier\":3,\"distanceMultiplier\":2,\"rotY\":91}'),
	(416,103,42,143,4,4,NULL,40,'{\"movementType\":1,\"speedMultiplier\":3,\"distanceMultiplier\":2,\"rotY\":89}'),
	(422,101,31,171,4,4,NULL,40,'{\"movementType\":2,\"speedMultiplier\":1,\"distanceMultiplier\":12,\"rotY\":90}'),
	(423,3,19,140,4,8,NULL,0,'{\"invisible\":true}'),
	(424,3,3,140,4,7,NULL,0,'{\"targetExit\":423,\"invisible\":false}'),
	(432,240,6,145,1,46,37,0,'null'),
	(431,237,6,161,1,46,183,0,'null'),
	(429,247,5,155,1,46,218,0,'null'),
	(428,254,6,148,1,46,270,0,'null'),
	(425,256,2,107,1,46,263,0,'null'),
	(430,244,5,158,1,46,168,0,'null'),
	(426,261,2,116,1,46,266,0,'null'),
	(427,254,3,134,1,46,240,0,'null'),
	(433,252,3,134,1,46,42,0,'null'),
	(434,259,3,125,1,46,58,0,'null'),
	(435,-119,9,-28,1,1,234,0,'null'),
	(436,-119,9,-28,1,38,234,0,'null'),
	(437,-119,9,-28,1,38,234,0,'null'),
	(442,-249,-1,-104,1,42,322,0,'null'),
	(445,-567,3,30,1,9,NULL,1,'{\"text\":\"Sludgewood | Forest\",\"fontSize\":20,\"rotY\":66}'),
	(444,-567,3,27,1,9,NULL,1,'{\"text\":\"Leslie\'s Plaice\",\"fontSize\":20,\"rotY\":318}'),
	(446,-559,3,27,1,9,NULL,1,'{\"text\":\"Ravenwood | Village\",\"fontSize\":20,\"rotY\":195}'),
	(447,-593,-1,-24,1,76,253,0,'null'),
	(448,-588,-1,-37,1,75,147,0,'null'),
	(453,44,1,141,4,5,NULL,40,'{\"movementType\":2,\"speedMultiplier\":4,\"distanceMultiplier\":17,\"rotY\":91,\"startOpen\":false}'),
	(455,2,1,107,4,6,NULL,0,'{\"switchNumber\":453}'),
	(461,185,3,277,4,6,NULL,0,'{\"switchNumber\":459}'),
	(466,134,10,204,4,4,NULL,40,'{\"movementType\":2,\"speedMultiplier\":1,\"distanceMultiplier\":7,\"rotY\":180}'),
	(624,193,19,74,4,91,360,0,'null'),
	(468,193,19,70,4,68,0,0,'null'),
	(625,193,19,67,4,91,1,0,'null'),
	(470,193,19,64,4,68,1,0,'null'),
	(626,193,19,61,4,91,358,0,'null'),
	(472,193,19,58,4,68,1,0,'null'),
	(627,193,19,55,4,91,360,0,'null'),
	(474,193,19,51,4,68,358,0,'null'),
	(628,193,19,48,4,91,360,0,'null'),
	(476,193,19,45,4,68,1,0,'null'),
	(629,193,19,41,4,91,358,0,'null'),
	(478,193,19,38,4,68,1,0,'null'),
	(479,215,19,40,4,68,181,0,'null'),
	(480,214,19,43,4,68,181,0,'null'),
	(481,214,19,46,4,68,181,0,'null'),
	(482,214,19,50,4,68,179,0,'null'),
	(483,215,19,53,4,68,179,0,'null'),
	(484,214,19,56,4,68,179,0,'null'),
	(485,214,19,59,4,68,181,0,'null'),
	(486,214,19,62,4,68,181,0,'null'),
	(487,214,19,66,4,68,181,0,'null'),
	(488,214,19,69,4,68,179,0,'null'),
	(489,214,19,72,4,68,179,0,'null'),
	(490,-40,1,141,4,5,NULL,40,'{\"movementType\":2,\"speedMultiplier\":3,\"distanceMultiplier\":17,\"rotY\":270,\"startOpen\":false}'),
	(492,288,37,-157,4,6,NULL,0,'{\"switchNumber\":490}'),
	(496,307,28,-117,4,4,NULL,40,'{\"movementType\":2,\"speedMultiplier\":1,\"distanceMultiplier\":9,\"rotY\":180}'),
	(504,-638,14,441,1,45,297,0,'null'),
	(505,-637,16,434,1,44,325,0,'null'),
	(506,-637,15,440,1,44,267,0,'null'),
	(507,-638,14,449,1,44,308,0,'null'),
	(508,-631,14,452,1,44,72,0,'null'),
	(509,-631,15,445,1,44,107,0,'null'),
	(510,-641,15,436,1,44,218,0,'null'),
	(511,-638,16,433,1,44,325,0,'null'),
	(512,-637,2,514,1,1,53,0,'null'),
	(513,-631,3,505,1,1,87,0,'null'),
	(514,-638,4,498,1,1,176,0,'null'),
	(515,-646,1,505,1,1,212,0,'null'),
	(516,-653,1,499,1,1,87,0,'null'),
	(517,-652,1,484,1,44,53,0,'null'),
	(518,-647,2,491,1,44,263,0,'null'),
	(519,-646,1,506,1,44,293,0,'null'),
	(520,-640,3,507,1,44,6,0,'null'),
	(521,-630,3,504,1,44,309,0,'null'),
	(522,-636,2,515,1,44,233,0,'null'),
	(523,-646,1,544,1,44,149,0,'null'),
	(524,-649,1,543,1,52,168,0,'null'),
	(525,-653,1,540,1,52,71,0,'null'),
	(526,-649,1,532,1,52,151,0,'null'),
	(527,-650,1,530,1,44,317,0,'null'),
	(528,-645,0,533,1,44,323,0,'null'),
	(529,-641,1,539,1,44,233,0,'null'),
	(532,-599,3,469,1,44,20,0,'null'),
	(531,-592,1,466,1,44,134,0,'null'),
	(533,-586,2,464,1,44,78,0,'null'),
	(534,-580,3,460,1,38,160,0,'null'),
	(535,-592,1,467,1,38,209,0,'null'),
	(538,-179,12,155,1,72,71,0,'null'),
	(540,-138,6,172,1,38,250,0,'null'),
	(541,-133,6,185,1,38,290,0,'null'),
	(542,-128,4,197,1,38,266,0,'null'),
	(543,-135,8,207,1,52,193,0,'null'),
	(544,-140,11,195,1,52,111,0,'null'),
	(545,-144,12,182,1,1,114,0,'null'),
	(546,-154,6,131,1,30,139,0,'null'),
	(547,-151,5,131,1,38,260,0,'null'),
	(567,-270,21,118,1,41,67,0,'null'),
	(566,-268,19,128,1,41,74,0,'null'),
	(561,-277,21,123,1,65,186,0,'null'),
	(562,-277,21,123,1,42,141,0,'null'),
	(563,-272,20,125,1,42,216,0,'null'),
	(564,-275,19,131,1,42,169,0,'null'),
	(565,-274,17,139,1,41,66,0,'null'),
	(568,-266,21,111,1,41,116,0,'null'),
	(569,-271,23,105,1,41,173,0,'null'),
	(570,-295,27,78,1,42,152,0,'null'),
	(571,-296,26,67,1,42,86,0,'null'),
	(572,-288,27,72,1,41,263,0,'null'),
	(573,-256,41,60,1,41,130,0,'null'),
	(574,-436,2,-26,1,38,185,0,'null'),
	(575,-429,3,-25,1,46,168,0,'null'),
	(576,-434,4,-18,1,46,205,0,'null'),
	(578,-452,2,-23,1,41,247,0,'null'),
	(579,-472,3,-15,1,30,168,0,'null'),
	(580,-499,3,4,1,52,144,0,'null'),
	(581,-503,2,2,1,52,185,0,'null'),
	(582,-502,2,0,1,46,186,0,'null'),
	(583,-598,7,62,1,1,56,0,'null'),
	(584,-596,7,54,1,1,56,0,'null'),
	(585,-590,6,61,1,52,344,0,'null'),
	(586,-575,5,63,1,52,111,0,'null'),
	(587,-572,5,60,1,38,141,0,'null'),
	(588,-579,5,55,1,38,171,0,'null'),
	(589,-588,6,51,1,38,191,0,'null'),
	(601,273,19,-153,4,4,NULL,40,'{\"movementType\":3,\"speedMultiplier\":2,\"distanceMultiplier\":5,\"rotY\":91}'),
	(605,262,19,-161,4,4,NULL,40,'{\"movementType\":1,\"speedMultiplier\":1.5,\"distanceMultiplier\":5,\"rotY\":90}'),
	(608,262,1,-167,4,5,NULL,40,'{\"movementType\":2,\"speedMultiplier\":4,\"distanceMultiplier\":18,\"rotY\":180,\"startOpen\":false}'),
	(610,377,37,-108,4,6,NULL,0,'{\"switchNumber\":608}'),
	(614,310,37,-157,4,4,NULL,40,'{\"movementType\":1,\"speedMultiplier\":0.5,\"distanceMultiplier\":11.5,\"rotY\":180}'),
	(620,299,29,-135,4,5,NULL,40,'{\"movementType\":2,\"speedMultiplier\":2,\"distanceMultiplier\":7.5,\"rotY\":360,\"startOpen\":false}'),
	(622,263,19,-178,4,6,NULL,0,'{\"switchNumber\":620}'),
	(632,-18,0,9,2,87,269,0,'null'),
	(633,-11,0,-1,2,87,274,0,'null'),
	(634,-10,0,-4,2,86,73,0,'null'),
	(635,-8,0,-3,2,86,31,0,'null'),
	(636,-7,0,-10,2,85,305,0,'null'),
	(637,-7,0,-8,2,82,241,0,'null'),
	(638,-5,0,-10,2,84,58,0,'null'),
	(639,-46,0,-36,2,47,152,0,'null'),
	(640,-47,0,-37,2,91,251,0,'null'),
	(641,-48,0,-37,2,73,291,0,'null'),
	(642,-55,0,-31,2,77,256,0,'null'),
	(643,291,1,-105,4,5,NULL,40,'{\"movementType\":2,\"speedMultiplier\":3,\"distanceMultiplier\":18,\"rotY\":359,\"startOpen\":false}'),
	(649,290,1,-25,4,5,NULL,40,'{\"movementType\":2,\"speedMultiplier\":3,\"distanceMultiplier\":17,\"rotY\":180,\"startOpen\":false}'),
	(647,251,19,28,4,6,NULL,0,'{\"switchNumber\":643}'),
	(651,317,19,-28,4,6,NULL,0,'{\"switchNumber\":649}'),
	(656,283,19,-124,4,89,305,0,'null'),
	(658,283,19,-128,4,89,308,0,'null'),
	(672,290,18,-117,4,4,NULL,40,'{\"movementType\":5,\"speedMultiplier\":0.5,\"distanceMultiplier\":3,\"rotY\":89}'),
	(659,299,19,-124,4,89,226,0,'null'),
	(660,299,19,-127,4,89,221,0,'null'),
	(675,3,0,94,4,5,NULL,40,'{\"movementType\":2,\"speedMultiplier\":4,\"distanceMultiplier\":18,\"rotY\":179,\"startOpen\":false}'),
	(677,2,87,120,4,6,NULL,0,'{\"switchNumber\":675}'),
	(679,299,37,-126,4,4,NULL,40,'{\"movementType\":3,\"speedMultiplier\":1.5,\"distanceMultiplier\":4,\"rotY\":269}'),
	(680,299,37,-114,4,4,NULL,40,'{\"movementType\":3,\"speedMultiplier\":1,\"distanceMultiplier\":4,\"rotY\":268}'),
	(681,299,38,-100,4,4,NULL,40,'{\"movementType\":3,\"speedMultiplier\":2,\"distanceMultiplier\":4,\"rotY\":270}'),
	(683,299,38,-89,4,4,NULL,40,'{\"movementType\":3,\"speedMultiplier\":0.5,\"distanceMultiplier\":2,\"rotY\":270}'),
	(687,288,37,-193,4,4,NULL,40,'{\"movementType\":1,\"speedMultiplier\":0.5,\"distanceMultiplier\":8,\"rotY\":359}'),
	(794,-190,18,157,4,5,NULL,40,'{\"movementType\":3,\"speedMultiplier\":1,\"distanceMultiplier\":2,\"rotY\":179,\"startOpen\":false}'),
	(785,-184,19,152,4,6,NULL,0,'{\"switchNumber\":784}'),
	(754,299,37,-193,4,4,NULL,53,'{\"movementType\":3,\"speedMultiplier\":0.5,\"distanceMultiplier\":5,\"rotY\":359}'),
	(755,302,37,-193,4,4,NULL,53,'{\"movementType\":3,\"speedMultiplier\":0.5,\"distanceMultiplier\":5,\"rotY\":359}'),
	(756,305,37,-193,4,4,NULL,53,'{\"movementType\":3,\"speedMultiplier\":0.5,\"distanceMultiplier\":5,\"rotY\":359}'),
	(758,308,37,-193,4,4,NULL,53,'{\"movementType\":3,\"speedMultiplier\":0.5,\"distanceMultiplier\":5,\"rotY\":359}'),
	(759,310,37,-193,4,4,NULL,53,'{\"movementType\":3,\"speedMultiplier\":0.5,\"distanceMultiplier\":5,\"rotY\":359}'),
	(760,313,37,-193,4,4,NULL,53,'{\"movementType\":3,\"speedMultiplier\":0.5,\"distanceMultiplier\":5,\"rotY\":359}'),
	(761,315,37,-193,4,4,NULL,53,'{\"movementType\":3,\"speedMultiplier\":0.5,\"distanceMultiplier\":5,\"rotY\":359}'),
	(762,318,37,-193,4,4,NULL,53,'{\"movementType\":3,\"speedMultiplier\":0.5,\"distanceMultiplier\":5,\"rotY\":359}'),
	(766,286,37,-184,4,9,NULL,1,'{\"text\":\"Bridge | of Terror\",\"fontSize\":20,\"rotY\":1}'),
	(765,290,37,-184,4,9,NULL,1,'{\"text\":\"Stairs | of Cowardice\",\"fontSize\":20,\"rotY\":179}'),
	(767,2,165,67,4,8,NULL,0,'{\"invisible\":true}'),
	(768,-223,23,-110,4,7,NULL,0,'{\"targetExit\":767,\"invisible\":false}'),
	(769,-286,19,-279,4,8,NULL,0,'{\"invisible\":true}'),
	(770,-232,19,186,4,7,NULL,0,'{\"targetExit\":769,\"invisible\":false}'),
	(784,-181,3,148,4,5,NULL,40,'{\"movementType\":2,\"speedMultiplier\":2,\"distanceMultiplier\":15,\"rotY\":179,\"startOpen\":false}'),
	(796,-195,3,162,4,6,NULL,0,'{\"switchNumber\":795}'),
	(799,-162,10,199,4,4,NULL,40,'{\"movementType\":2,\"speedMultiplier\":0.3,\"distanceMultiplier\":10,\"rotY\":91}'),
	(806,258,57,-190,1,10,NULL,13,'{\"loot\":\"100:7;100:24\",\"respawnTime\":2000,\"rotY\":193}'),
	(814,267,8,111,1,10,NULL,13,'{\"loot\":\"100:42;100:26\",\"respawnTime\":2000,\"rotY\":80}'),
	(840,-719,37,199,1,4,NULL,53,'{\"movementType\":1,\"speedMultiplier\":1,\"distanceMultiplier\":4,\"rotY\":91}'),
	(842,-723,37,193,1,4,NULL,53,'{\"movementType\":3,\"speedMultiplier\":1,\"distanceMultiplier\":2,\"rotY\":181}'),
	(853,-718,36,191,1,4,NULL,53,'{\"movementType\":1,\"speedMultiplier\":2,\"distanceMultiplier\":1,\"rotY\":91}'),
	(847,-710,36,190,1,4,NULL,53,'{\"movementType\":2,\"speedMultiplier\":1,\"distanceMultiplier\":3,\"rotY\":91}'),
	(848,-704,37,190,1,4,NULL,53,'{\"movementType\":2,\"speedMultiplier\":1.5,\"distanceMultiplier\":3,\"rotY\":90}'),
	(850,-702,35,195,1,4,NULL,53,'{\"movementType\":1,\"speedMultiplier\":1,\"distanceMultiplier\":3,\"rotY\":0}'),
	(858,-699,36,201,1,4,NULL,53,'{\"movementType\":3,\"speedMultiplier\":1,\"distanceMultiplier\":1.3,\"rotY\":270}'),
	(860,-699,36,203,1,4,NULL,53,'{\"movementType\":3,\"speedMultiplier\":1,\"distanceMultiplier\":1.3,\"rotY\":270}'),
	(861,-699,36,205,1,4,NULL,53,'{\"movementType\":3,\"speedMultiplier\":1,\"distanceMultiplier\":1.3,\"rotY\":270}'),
	(862,-699,36,208,1,4,NULL,53,'{\"movementType\":3,\"speedMultiplier\":1,\"distanceMultiplier\":1.3,\"rotY\":270}'),
	(863,-699,36,212,1,4,NULL,53,'{\"movementType\":3,\"speedMultiplier\":1,\"distanceMultiplier\":1.3,\"rotY\":270}'),
	(879,-699,39,216,1,4,NULL,53,'{\"movementType\":2,\"speedMultiplier\":2,\"distanceMultiplier\":5,\"rotY\":270}'),
	(880,-699,47,213,1,4,NULL,53,'{\"movementType\":2,\"speedMultiplier\":2.5,\"distanceMultiplier\":5,\"rotY\":1}'),
	(881,-699,48,203,1,4,NULL,53,'{\"movementType\":3,\"speedMultiplier\":2.5,\"distanceMultiplier\":5,\"rotY\":269}'),
	(893,-706,47,196,1,4,NULL,40,'{\"movementType\":1,\"speedMultiplier\":1,\"distanceMultiplier\":7,\"rotY\":271}'),
	(888,-722,25,253,1,4,NULL,40,'{\"movementType\":2,\"speedMultiplier\":1,\"distanceMultiplier\":0.5,\"rotY\":91}'),
	(896,-711,43,210,1,10,NULL,13,'{\"loot\":\"100:6\",\"respawnTime\":2000,\"rotY\":360}'),
	(897,-665,-1,209,1,38,190,0,'null'),
	(898,-669,-1,213,1,38,200,0,'null'),
	(899,-670,-1,208,1,38,94,0,'null'),
	(900,-665,-1,204,1,44,326,0,'null'),
	(901,-670,-1,202,1,44,177,0,'null'),
	(902,-670,-1,208,1,82,317,0,'null'),
	(904,-4,16,5,1,90,331,0,'null'),
	(905,88,9,51,1,9,NULL,2,'{\"text\":\"Upcoming | Bank\",\"fontSize\":20,\"rotY\":51}'),
	(912,-687,3,122,1,8,NULL,0,'{\"invisible\":true}'),
	(913,-681,2,117,1,7,NULL,0,'{\"targetExit\":912,\"invisible\":false}'),
	(968,-1336,112,560,1,7,NULL,0,'{\"targetExit\":967,\"invisible\":false}'),
	(937,-696,7,112,1,59,83,0,'null'),
	(938,-695,7,111,1,59,45,0,'null'),
	(939,-697,7,106,1,59,108,0,'null'),
	(940,-698,7,104,1,59,129,0,'null'),
	(941,-697,7,105,1,59,91,0,'null'),
	(949,-13,2,-17,2,90,267,0,'null'),
	(950,-19,2,-7,2,77,154,0,'null'),
	(953,-20,0,17,2,77,180,0,'null'),
	(952,-19,0,-7,2,79,72,0,'null'),
	(959,-7,0,7,2,78,119,0,'null'),
	(964,-679,-4,142,1,5,NULL,4,'{\"movementType\":2,\"speedMultiplier\":1,\"distanceMultiplier\":0.5,\"rotY\":8,\"startOpen\":false}'),
	(966,-686,3,119,1,6,NULL,0,'{\"switchNumber\":964}'),
	(967,-1264,79,519,1,8,NULL,0,'{\"invisible\":true}'),
	(969,-1336,112,556,1,8,NULL,0,'{\"invisible\":true}'),
	(970,-1264,79,521,1,7,NULL,0,'{\"targetExit\":969,\"invisible\":false}'),
	(972,-1382,11,195,1,73,14,0,'null'),
	(975,-1381,11,196,1,59,355,0,'null'),
	(976,-1374,12,199,1,59,300,0,'null'),
	(977,-1372,13,212,1,59,230,0,'null'),
	(978,-1388,10,218,1,59,39,0,'null'),
	(979,-1381,11,216,1,59,22,0,'null'),
	(980,-1385,11,207,1,59,140,0,'null'),
	(981,-1394,9,196,1,59,138,0,'null'),
	(982,-1381,11,191,1,59,334,0,'null'),
	(983,-1378,11,189,1,74,277,0,'null'),
	(984,-1379,11,197,1,74,257,0,'null'),
	(985,-1385,11,208,1,74,282,0,'null'),
	(986,-1380,11,217,1,74,19,0,'null'),
	(987,-1373,12,214,1,74,118,0,'null'),
	(990,-1328,21,-17,1,30,135,0,'null'),
	(991,-1331,22,-21,1,30,125,0,'null'),
	(992,-1329,22,-32,1,30,39,0,'null'),
	(993,-1330,22,-35,1,60,172,0,'null'),
	(994,-1337,24,-28,1,60,255,0,'null'),
	(995,-1337,23,-9,1,77,240,0,'null'),
	(996,-1342,25,-5,1,32,252,0,'null'),
	(997,-1338,27,8,1,32,359,0,'null'),
	(998,-1333,25,7,1,32,61,0,'null'),
	(999,-1398,30,-35,1,57,222,0,'null'),
	(1000,-1404,30,-31,1,57,178,0,'null'),
	(1001,-1409,29,-32,1,57,145,0,'null'),
	(1002,-1412,29,-34,1,80,145,0,'null'),
	(1003,-1416,28,-36,1,60,245,0,'null'),
	(1004,-1415,29,-25,1,60,335,0,'null'),
	(1005,132,43,-132,1,8,NULL,0,'{\"invisible\":true}'),
	(1006,336,5,-180,1,7,NULL,0,'{\"targetExit\":1005,\"invisible\":false}'),
	(1007,-9,0,-18,2,93,195,0,'null'),
	(1008,-14,0,-16,2,93,351,0,'null'),
	(1017,-106,1,54,3,9,NULL,3,'{\"text\":\"Are you ready|for your first|big challenge?|\",\"fontSize\":30,\"rotY\":88}');

/*!40000 ALTER TABLE `ib_units` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table ib_zones
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ib_zones`;

CREATE TABLE `ib_zones` (
  `id` smallint(4) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` tinyint(3) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `ib_zones` WRITE;
/*!40000 ALTER TABLE `ib_zones` DISABLE KEYS */;

INSERT INTO `ib_zones` (`id`, `name`, `type`)
VALUES
	(1,'World',1),
	(2,'Developer\'s Zone',2),
	(3,'Tutorial',3),
	(4,'Ironbane Castle',4),
	(5,'Underground River',2),
	(6,'Bat Cave',2),
	(7,'Ironbane\'s Chamber',4);

/*!40000 ALTER TABLE `ib_zones` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table sessions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `sessions` (
  `sid` varchar(255) NOT NULL,
  `session` text NOT NULL,
  `expires` int(11) DEFAULT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
