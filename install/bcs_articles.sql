-- MySQL dump 10.13  Distrib 5.5.16, for Win32 (x86)
--
-- Host: localhost    Database: ironbane_dev
-- ------------------------------------------------------
-- Server version	5.1.65-community

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bcs_articles`
--

DROP TABLE IF EXISTS `bcs_articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bcs_articles` (
  `articleId` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `body` text NOT NULL,
  `author` int(11) NOT NULL DEFAULT '0',
  `created` int(11) DEFAULT NULL,
  `views` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`articleId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bcs_articles`
--

/*!40000 ALTER TABLE `bcs_articles` DISABLE KEYS */;
INSERT INTO `bcs_articles` VALUES ('get-involved','Get Involved','## How does this work?\r\nAnyone can contribute something at any time. All you need is an account for Ironbane.\r\n\r\nWhen you add a contribution, you earn **reputation** (rep), which will be visible on your profile and on the forum. A higher rep allows you to get more privileges, such as becoming a moderator or game master, GitHub access, the ability to give others reputation for their work and more. We want to reward people for their work.\r\n\r\n##How much rep do I get for a contribution?\r\nThis will depends on the quality of work you provide, but here are some generic guidelines:\r\n###Generic reputation award table\r\n\r\n<table width=\"100%\" border=\"1\" cellspacing=\"0\" cellpadding=\"4\" class=\"forumcontainer\">\r\n            <thead>\r\n             <tr>\r\n                <th>Action</th>\r\n                <th>Reward</th>\r\n            </tr>\r\n</thead>\r\n<tbody>\r\n            <tr>\r\n                <td class=\"row1\">Forum post</td>\r\n                <td class=\"row1\">1 rep</td>\r\n            </tr>\r\n            <tr>\r\n                <td class=\"row2\">Bug report</td>\r\n                <td class=\"row2\">5 rep</td>\r\n            </tr>\r\n             <tr>\r\n                <td class=\"row1\">Contributed content (art/music/model)</td>\r\n                <td class=\"row1\">10 rep (+ Bonus depending on quality)</td>\r\n            </tr>\r\n            <tr>\r\n                <td class=\"row2\">Accepted pull request</td>\r\n                <td class=\"row2\">20 rep (+ Bonus depending on quality)</td>\r\n            </tr>\r\n        </tbody>\r\n</table>\r\n\r\n## What can I work on?\r\nIf you were to join, what would you love to work on? Skill is important, but more important is your love for the skill. It doesn\'t matter if you suck, the only thing that is important is motivation. You must be willing to learn from others.\r\n\r\n<h2 class=\"centered\">[I want to code\\!](/article/get-involved-code)</h2>\r\n<p class=\"centered\">\r\n![coding](/images/uploads/public/code.png)\r\n</p>\r\n\r\n<h2 class=\"centered\">[I want to create 3D models\\!](/article/get-involved-models)</h2>\r\n<p class=\"centered\">\r\n![coding](/images/uploads/public/models.png)\r\n</p>\r\n\r\n<h2 class=\"centered\"> [I want to make art\\!](/article/get-involved-art)</h2>\r\n<p class=\"centered\">\r\n![coding](/images/uploads/public/art.png)\r\n</p>\r\n\r\nLooking for something else? Give a shout at the forums and let us know what you\'d like to help out with!',0,1368850945,0);
/*!40000 ALTER TABLE `bcs_articles` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-08-14 15:15:18
