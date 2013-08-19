/*
SQLyog Community v11.13 (64 bit)
MySQL - 5.5.16-log : Database - ironbane
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`ironbane` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `ironbane`;

/*Table structure for table `forum_topics` */

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
  `title` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `board_id` (`board_id`)
) ENGINE=MyISAM AUTO_INCREMENT=842 DEFAULT CHARSET=latin1;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
