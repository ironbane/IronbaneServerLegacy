CREATE DATABASE  IF NOT EXISTS `ironbane` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `ironbane`;
-- MySQL dump 10.13  Distrib 5.5.16, for Win32 (x86)
--
-- Host: localhost    Database: ironbane
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
-- Table structure for table `bcs_menu`
--

DROP TABLE IF EXISTS `bcs_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bcs_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL DEFAULT 'New Menu Item',
  `path` varchar(255) NOT NULL DEFAULT '/',
  `sort` int(11) NOT NULL DEFAULT '0',
  `security` varchar(255) DEFAULT NULL,
  `target` varchar(45) DEFAULT NULL COMMENT 'default null, do we need _new or _blank or _self ? use thise',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bcs_menu`
--

LOCK TABLES `bcs_menu` WRITE;
/*!40000 ALTER TABLE `bcs_menu` DISABLE KEYS */;
INSERT INTO `bcs_menu` VALUES (1,'About','/',1,NULL,NULL),(2,'Play!','/game',3,NULL,'_self'),(3,'Forum','/forum',2,NULL,NULL),(4,'Get Involved','/article/get-involved',4,NULL,NULL),(5,'Twitter','https://twitter.com/IronbaneMMO',5,NULL,'_blank'),(6,'Github','https://github.com/ironbane/IronbaneServer/tree/webapi',6,NULL,'_blank'),(7,'Editor','/editor',7,'EDITOR',NULL),(8,'Preferences','/profile',8,'USER','');
/*!40000 ALTER TABLE `bcs_menu` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-06-13 22:48:03
