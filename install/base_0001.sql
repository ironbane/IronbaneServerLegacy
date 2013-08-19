
DROP TABLE IF EXISTS `forum_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `forum_ratings` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `from` int(10) NOT NULL DEFAULT '0',
  `to_post` int(10) NOT NULL DEFAULT '0',
  `rating` varchar(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_ratings`
--

LOCK TABLES `forum_ratings` WRITE;
/*!40000 ALTER TABLE `forum_ratings` DISABLE KEYS */;
/*!40000 ALTER TABLE `forum_ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ib_meshes`
--

DROP TABLE IF EXISTS `ib_meshes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=MyISAM AUTO_INCREMENT=72 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ib_meshes`
--

LOCK TABLES `ib_meshes` WRITE;
/*!40000 ALTER TABLE `ib_meshes` DISABLE KEYS */;
INSERT INTO `ib_meshes` VALUES (1,'Fortress Wall Gate','Building','wallgate.obj',1.00,0,'tiles/35',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(2,'RIP Stone','Decoration','ripstone.obj',0.15,0,'tiles/34',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(3,'Well','Building','well.obj',1.50,0,'tiles/2',5.00,'tiles/1',0.30,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(4,'Tree1','Foliage','tree.obj',1.00,0,'tiles/99',1.00,'tiles/32',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(5,'Tree2','Foliage','tree2.obj',1.00,0,'tiles/12',1.00,'tiles/99',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(6,'Pinetree','Foliage','pinetree.obj',1.00,0,'tiles/31',0.50,'tiles/99',3.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(11,'Wooden Fence','Fence','fence.obj',1.00,1,'textures/fence',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(7,'Runestone','Decoration','rune.obj',1.00,0,'textures/rune',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(18,'Blacksmith','Building','blacksmith.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(10,'bookshelf','Decoration','bookshelf.obj',1.00,0,'textures/bookshelf',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(19,'House 1','Building','house1.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/15',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(43,'Square Grave','Decoration','squaregrave.obj',1.00,0,'textures/squaregrave1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(13,'Chest','Interactive','chest.obj',1.00,0,'textures/chest',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(14,'Normal Sign','Decoration','sign_normal.obj',1.00,0,'textures/sign_normal',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(15,'Huge Sign','Decoration','sign_huge.obj',1.00,0,'textures/sign_huge',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(16,'Direction Sign','Decoration','sign_direction.obj',1.00,0,'tiles/13',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(17,'Lever 1','Interactive','lever1.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(9,'Inn 1','Building','inn1.obj',1.00,0,'tiles/47',0.10,'tiles/1',0.10,'tiles/1',1.00,'tiles/9',1.00,'tiles/1',1.00,'tiles/15',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(8,'Grave Cross','Decoration','cross.obj',1.00,0,'tiles/34',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(20,'Town Hall','Building','townhall.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/15',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(21,'Blacksmith','Building','blacksmith.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(22,'Shack','Building','shack.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/15',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(23,'House 2','Building','house2.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(24,'House 2 With Basement','Building','house2_basement.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(25,'Terrain (Used for skybox)','Misc','terrain.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(26,'Iron Fence Long','Fence','ifence.obj',1.00,1,'textures/hironfence2',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(27,'Iron Fence Short','Fence','ironfenceshort.obj',1.00,1,'textures/hironfencesmall',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(28,'Bridge','Building','bridge.obj',1.00,0,'tiles/1',0.50,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(29,'Rock','Misc','rock.obj',1.00,0,'tiles/34',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(30,'Flatrock','Decoration','flatrock.obj',1.00,0,'tiles/34',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(31,'Lantern 1','Decoration','lantern.obj',1.00,0,'tiles/1',1.00,'tiles/2',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,1),(32,'Wall 4x4x1','Construction','wall_4_4_1.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(33,'Wall 8x8x1','Construction','wall_8_8_1.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(34,'Chair','Decoration','chair.obj',1.00,0,'tiles/15',1.00,'tiles/15',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(35,'Crate','Decoration','crate.obj',1.00,0,'tiles/25',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(36,'Table','Decoration','table.obj',1.00,0,'tiles/9',1.00,'tiles/9',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(37,'Anvil','Decoration','anvil.obj',1.00,0,'tiles/34',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(38,'Barrel','Decoration','barrel.obj',1.00,0,'tiles/26',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(39,'Block 4x4x2','Construction','block_4_4_2.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(40,'Block 4x4x1','Construction','block_4_4_1.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(42,'Dead Tree','Foilage','deadtree.obj',2.00,0,'tiles/99',0.10,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(44,'Fortress Wall','Building','wall.obj',1.00,0,'tiles/35',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(46,'Fortress Wall Tower','Building','tower.obj',1.00,0,'tiles/35',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(47,'Fortress Wall Tower (turn)','Building','tower2.obj',1.00,0,'tiles/35',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(48,'Fortress Wall Tower (room)','Building','tower3.obj',1.00,0,'tiles/35',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(49,'Portcullis','Building','portcullis.obj',1.00,1,'textures/portcullis',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(50,'Skullpile','Decoration','haypile2.obj',0.30,0,'textures/skullpile',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(51,'Haypile','Decoration','haypile.obj',0.50,0,'tiles/92',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(52,'Ironbane\'s Castle (unfinished, no touchy)','Building','ibcastle.obj',2.00,0,'tiles/35',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(53,'Beam Short','Construction','block_thin_short.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(56,'Wall 16x4x1','Construction','wall_16_4_1.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(54,'Wall 16x8x1','Construction','wall_16_8_1.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(55,'Wall 16x16x1','Construction','wall_16_16_1.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(57,'Wall 8x4x1','Construction','wall_8_4_1.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(58,'Wall 4x1x1','Construction','wall_4_1_1.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(59,'Wall 8x1x1','Construction','wall_8_1_1.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(60,'Wall 16x1x1','Construction','wall_16_1_1.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(61,'Wall 32x16x1','Construction','wall_32_16_1.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(62,'Wall 32x32x1','Construction','wall_32_32_1.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(63,'Painting 2x1','Decoration','painting_2x1.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(64,'Painting 4x3','Decoration','painting_4x3.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(65,'Slime shooter','Misc','lantern.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(66,'Slope 4x2x4','Construction','slope_4_2_4.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(67,'Slope 8x2x4','Construction','slope_8_2_4.obj',1.00,0,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(68,'Slope 8x4x4','Construction','slope_8_4_4.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(69,'Door 4x4x1','Construction','door_4_4_1.obj',1.00,0,'textures/door',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(70,'Door 8x8x1','Construction','door_8_8_1.obj',1.00,0,'textures/door',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0),(71,'Catacombs Entrance','Quests','crypt.obj',1.00,0,'tiles/47',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,'tiles/1',1.00,0);
/*!40000 ALTER TABLE `ib_meshes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ib_unit_templates`
--

DROP TABLE IF EXISTS `ib_unit_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=MyISAM AUTO_INCREMENT=77 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ib_unit_templates`
--

LOCK TABLES `ib_unit_templates` WRITE;
/*!40000 ALTER TABLE `ib_unit_templates` DISABLE KEYS */;
INSERT INTO `ib_unit_templates` VALUES (1,'an','Acid Zombie',20,10,0,0,0,0,0,0,10,10,'9',2,'5:9;15:6',200,0,1.00,30,30,0,0,0,1.00,0,0),(2,'a','Loot Bag',2,0,0,0,0,0,0,0,0,0,'',3,'',30,1,1.00,0,0,1,0,0,1.00,0,0),(3,'a','Vendor',21,1001,1000,1000,1,1,1,1,10,10,'1',3,'1;27;26;8;29;16;16;',30,1,1.00,0,10,0,0,0,1.00,0,0),(4,'a','Moving Obstacle',6,0,0,0,0,0,0,0,1,0,'',3,'',30,1,1.00,10,10,1,0,0,1.00,0,0),(5,'a','Toggleable Obstacle',8,0,0,0,0,0,0,0,1,0,'',3,'',30,1,1.00,10,10,1,0,0,1.00,0,0),(6,'a','Lever',9,0,0,0,0,0,0,0,1,0,'',3,'',30,1,1.00,10,10,1,0,0,1.00,0,0),(7,'a','Teleport Entrance',10,0,0,0,0,0,0,0,1,0,'',3,'',30,1,1.00,10,10,1,0,0,1.00,0,0),(8,'a','Teleport Exit',11,0,0,0,0,0,0,0,1,0,'',3,'',30,1,1.00,10,10,1,0,0,1.00,0,0),(9,'a','Sign',12,0,0,0,0,0,0,0,1,0,'',3,'',30,1,1.00,10,10,1,0,0,1.00,0,0),(30,'a','Skeleton',20,11,0,0,0,0,0,0,6,4,'12',3,'5:22;30:1;15:18;12:19;10;20',200,0,1.00,10,30,0,0,0,1.00,0,0),(10,'a','Lootable Mesh',2,0,0,0,0,0,0,0,1,0,'',3,'',30,1,1.00,0,0,1,0,0,1.00,0,0),(31,'a','Bone Turret',22,10,0,0,0,0,0,0,1,100,'12',3,'',30,1,1.00,10,10,0,0,0,1.00,0,0),(11,'a','Heart Piece',13,0,0,0,0,0,0,0,1,0,'',3,'',30,1,1.00,10,10,1,0,0,1.00,0,0),(32,'a','Ghost',20,24,0,0,0,0,0,0,15,5,'21',3,'20:16;15:26;10:27;1:35;15:34;',60,0,1.00,30,30,0,0,0,1.00,0,0),(38,'a','Green Slime',20,1020,0,0,0,0,0,0,4,0,'48',2,'30:15;10:1;5:5;5:27;1:24;1:6',30,0,1.00,20,20,0,0,0,1.00,1,0),(66,'The','Ugarth the Ugly',20,11,0,0,2,2,2,0,30,20,'30',3,'100:16;100:1;20:19;15:18;5:10;30:8;1:35;5:24;10:26;16:20;30:28;',2000,1,3.00,15,15,0,0,0,0.00,0,0),(40,'','Bernard',21,1003,1000,1000,1,1,0,1,8,3,'',3,'13;14;15',30,0,1.00,10,10,0,0,0,1.00,0,0),(41,'a','Bandit',20,1001,1000,1,1,1,1,0,8,3,'1',3,'15:7;30:1;10:6;13:5;35:15;5:28',120,1,1.00,10,40,0,0,0,1.00,0,0),(42,'a','Bowman',20,1001,1000,0,1,1,1,0,10,2,'8',5,'15:7;10:8;10:6;13:5;35:15',40,1,1.00,10,40,0,0,0,1.00,0,0),(45,'The','Viking Slime Boss',20,1031,0,0,0,0,0,0,30,15,'1',3,'',2000,1,2.00,10,10,0,0,0,4.00,0,0),(44,'a','Viking Slime',20,1024,0,0,0,0,0,0,3,5,'27',3,'',120,1,1.00,10,10,0,0,0,1.00,1,0),(46,'a','Goblin',20,1030,0,0,0,0,0,0,2,2,'45',5,'',30,1,1.00,20,20,0,0,0,1.00,0,0),(47,'','William',21,1001,1000,1001,1,1,1,1,20,15,'1',3,'1;5;6;7;18;19;20',30,1,1.00,10,10,0,0,0,1.00,0,0),(48,'','Mari-Ann',21,1011,1018,1014,1,1,0,1,2,0,'',3,'100:1;100:15;100:15;100:8;100:26',30,1,1.00,10,10,0,0,0,1.00,0,0),(72,'Mrs.','Erma',21,1011,1018,1010,1,3,0,1,10,20,'',3,'16;16;16;28;29;59',30,1,1.00,10,10,0,0,0,1.00,0,0),(52,'a','Purple Slime',20,1025,0,0,0,0,0,0,5,0,'8',10,'25:8',60,1,1.00,15,8,0,0,0,1.00,0,0),(55,'The','Alabaster King',20,11,0,0,0,0,0,0,30,30,'23',0,'100:23;29:29;50:15;75:16;10:30;1:35;',3600,1,3.00,20,20,0,0,0,0.00,0,0),(65,'The','Bandit Leader',20,1001,1002,1000,1,0,6,0,30,25,'46',3,'30:46;40:47;20:45;25:27;40:26;',1600,1,3.00,15,15,0,0,0,3.00,0,0),(57,'a','Wraith',20,28,0,0,0,0,0,0,15,5,'21',1,'',100,0,1.20,12,12,0,0,0,0.00,0,0),(58,'The','Specter',20,28,0,0,0,0,0,0,50,20,'21',0,'',1600,0,3.00,20,20,0,0,0,0.00,0,0),(59,'a','Demon Bunny',20,29,0,0,0,0,0,0,3,1,'51',1,'15:24;25:1;15:27;10:45;50:40;',30,0,1.00,10,10,0,0,0,0.00,1,0),(60,'a','Red Bones',20,30,0,0,0,0,0,0,12,8,'12',3,'10:29;15:38;10:35;',60,0,1.50,15,15,0,0,0,0.00,0,0),(61,'a','Knight Statue',20,1000,0,0,2,2,2,0,1,20,'1',3,'',120,1,1.00,1,30,0,0,0,0.00,0,0),(62,'The','Knight Lord',20,1000,0,0,2,2,3,0,1,30,'54',3,'',200,1,3.00,20,20,0,0,0,0.00,0,0),(68,'a','Tutorial Slime Shooter',24,0,0,0,0,0,0,0,1,1,'56',3,'',30,0,1.00,20,20,0,0,0,0.00,0,0),(69,'a','Rat Boss',20,32,0,0,0,0,0,0,6,5,'58',3,'40:14',30,0,2.00,10,20,0,0,0,1.00,1,0),(70,'a','Rat',20,27,0,0,0,0,0,0,2,0,'57',3,'',30,0,1.00,10,20,0,0,0,1.00,1,0),(71,'a','Music Player',14,0,0,0,0,0,0,0,1,0,'',3,'',30,1,1.00,10,10,1,0,0,1.00,0,0),(73,'','Snuffles, the Destructor',20,33,0,0,0,0,0,0,30,10,'61',3,'',1000,0,3.00,60,100,0,0,0,1.00,1,0),(74,'a','Black Rabbit',20,33,0,0,0,0,0,0,6,2,'62',3,'',50,0,1.20,30,30,0,0,0,1.00,1,0),(75,'','John',1,1002,1000,1001,1,1,0,1,10,10,'1',3,'',30,1,1.00,10,10,0,0,0,1.00,0,0),(76,'','Leslie',21,1001,1006,0,2,0,0,1,20,10,'24',3,'24;63',30,1,1.50,10,10,0,0,0,1.00,0,0);
/*!40000 ALTER TABLE `ib_unit_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ib_item_templates`
--

DROP TABLE IF EXISTS `ib_item_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=66 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ib_item_templates`
--

LOCK TABLES `ib_item_templates` WRITE;
/*!40000 ALTER TABLE `ib_item_templates` DISABLE KEYS */;
INSERT INTO `ib_item_templates` VALUES (1,'Dull Sword',14,'weapon','sword',2,0.50,'',0),(18,'Iron Helmet',2,'armor','head',4,1.00,'',0),(5,'Wooden Helmet',1,'armor','head',2,1.00,'',1),(6,'Wooden Armor',1,'armor','body',6,1.00,'',1),(7,'Wooden Leggings',1,'armor','feet',4,1.00,'',1),(8,'Old Bow',5,'weapon','bow',2,1.25,'ARROW',0),(9,'Acid Staff',15,'weapon','staff',4,1.50,'ACIDBALL',0),(10,'Firewand',16,'weapon','staff',4,1.00,'FIREBALL',0),(11,'Book',8,'tool','book',2,1.00,'',0),(12,'Bone Thrower',0,'weapon','staff',2,1.00,'BONE',0),(13,'Meat on the Bones',9,'consumable','restorative',3,1.00,'',0),(14,'Bottle of Wine',10,'consumable','restorative',-1,1.00,'HEALSPARKS',0),(15,'Red Apple',11,'consumable','restorative',2,1.00,'',0),(16,'Health Potion',12,'consumable','restorative',20,1.00,'HEALSPARKS',0),(17,'Scroll',13,'tool','book',0,1.00,'',0),(19,'Iron Armor',2,'armor','body',12,1.00,'',0),(20,'Iron Leggings',2,'armor','feet',8,1.00,'',0),(21,'Plasma Gun',0,'weapon','staff',4,2.00,'PLASMABALL',0),(22,'Bone Sword',1,'weapon','sword',2,2.00,'',0),(23,'Alabaster Axe',25,'weapon','axe',16,2.00,'',0),(24,'Claymore',31,'weapon','sword',6,0.75,'',0),(25,'Long Bow',61,'weapon','bow',4,2.00,'ARROW',0),(26,'Dull Dagger',55,'weapon','dagger',1,0.25,'',0),(27,'Dull Axe',21,'weapon','axe',4,1.00,'',0),(28,'Healing Wand',6,'weapon','staff',-1,1.50,'PLASMABALL',0),(29,'Staff of Lesser Healing',62,'weapon','staff',-4,0.50,'PLASMABALL',0),(30,'Axe of Speed',25,'weapon','axe',2,0.50,'',0),(31,'Zombiefinger',27,'weapon','staff',1,0.30,'ACIDBALL',0),(32,'Honey',28,'consumable','restorative',5,1.00,'',0),(33,'Average Axe',17,'weapon','axe',8,1.00,'',0),(34,'White Tunic',3,'armor','body',1,1.00,'',0),(35,'Bloodmail',4,'armor','body',7,1.00,'',0),(36,'Map',13,'tool','map',0,1.00,'',0),(37,'Skullhead',10,'armor','head',5,1.00,'',0),(38,'Knight Helmet',3,'armor','head',3,1.00,'',0),(39,'Viking Helmet',9,'armor','head',3,1.00,'',0),(40,'Pear',71,'consumable','restorative',3,1.00,'',0),(41,'Strawberry',72,'consumable','restorative',2,1.00,'',0),(42,'Physalis',73,'consumable','restorative',3,1.00,'',0),(43,'Cherry',74,'consumable','restorative',2,1.00,'',0),(44,'Milk',75,'consumable','restorative',5,1.00,'',0),(45,'Rock',19,'weapon','bow',1,2.00,'ROCK',0),(46,'Bandit\'s Bow',61,'weapon','bow',3,0.75,'ARROW',0),(47,'Bandit\'s Hood',6,'armor','head',3,1.00,'',0),(48,'Slime Attack',0,'weapon','sword',1,2.00,'',0),(49,'Ironbane\'s Head',11,'armor','head',20,1.00,'',0),(50,'Castle Key 1',7,'tool','key',1720,1.00,'',0),(51,'AI: Demon Bunny Attack',0,'weapon','sword',1,0.25,'',0),(52,'Castle Key 2',7,'tool','key',1601,1.00,'',0),(53,'Ironbane\'s Chamber Key',77,'tool','key',1719,1.00,'',0),(54,'Double Axe',22,'weapon','axe',10,1.50,'',0),(55,'Superior Sword',32,'weapon','sword',6,0.50,'',0),(56,'AI: Slow Slime Attack',0,'weapon','staff',1,2.50,'SLIMEBALL',0),(57,'AI: Light Bash',0,'weapon','sword',1,1.50,'',0),(58,'AI: Medium Bash',0,'weapon','staff',2,2.00,'',0),(59,'Spellbook',8,'tool','book',4,1.00,'',0),(60,'Castle Gate Key',76,'tool','key',4,1.00,'',0),(61,'AI: Snuffles, the Destructor\'s',0,'weapon','sword',4,0.25,'',0),(62,'AI: Black Rabbit',0,'weapon','sword',2,0.50,'',0),(63,'Bass',20,'tool','restorative',3,1.00,'',0),(64,'Thiefdagger',64,'weapon','dagger',2,0.25,'',0),(65,'Kingsword',65,'weapon','sword',10,1.50,'',0);
/*!40000 ALTER TABLE `ib_item_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ib_books`
--

DROP TABLE IF EXISTS `ib_books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ib_books` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'This ID must be put in the ''attr1'' field of the book item. Leave blank to auto generate if you''re making a new book.',
  `title` varchar(255) NOT NULL COMMENT 'Only used for yourself to keep things organised :)',
  `text` text NOT NULL COMMENT 'The content of the book. <b>Use the ''&#124;'' character to separate pages.</b>|textarea',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ib_books`
--

LOCK TABLES `ib_books` WRITE;
/*!40000 ALTER TABLE `ib_books` DISABLE KEYS */;
INSERT INTO `ib_books` VALUES (1,'Saturn','Saturn is the sixth planet from the Sun and the second largest planet in the Solar System, after Jupiter. Named after the Roman god Saturn, its astronomical symbol (?) represents the god\'s sickle. Saturn is a gas giant with an average radius about nine times that of Earth.[12][13] While only one-eighth the average density of Earth, with its larger volume Saturn is just over 95 times as massive as Earth.[14][15][16]&nbsp;<div><br></div><div>|</div><div><br></div><div>Saturn\'s interior is probably composed of a core of iron, nickel and rock (silicon and oxygen compounds), surrounded by a deep layer of metallic hydrogen, an intermediate layer of liquid hydrogen and liquid helium and an outer gaseous layer.[17] The planet exhibits a pale yellow hue due to ammonia crystals in its upper atmosphere. Electrical current within the metallic hydrogen layer is thought to give rise to Saturn\'s planetary magnetic field, which is slightly weaker than Earth\'s and around one-twentieth the strength of Jupiter\'s.[18] The outer atmosphere is generally bland and lacking in contrast, although long-lived features can appear.&nbsp;</div><div><br></div><div>|</div><div><br></div><div>Wind speeds on Saturn can reach 1,800 km/h (1,100 mph), faster than on Jupiter, but not as fast as those on Neptune.[19]\r\nSaturn has a prominent ring system that consists of nine continuous main rings and three discontinuous arcs, composed mostly of ice particles with a smaller amount of rocky debris and dust. Sixty-two[20] known moons orbit the planet; fifty-three are officially named. This does not include the hundreds of \"moonlets\" within the rings. Titan, Saturn\'s largest and the Solar System\'s second largest moon, is larger than the planet Mercury and is the only moon in the Solar System to retain a substantial atmosphere.[21]</div>'),(3,'How to Fly: For Dummies!','<b><font size=\"4\">Flying for Dummies!</font></b><div><b><br></b><div>Get some of your friends to come over to your house, and then jump up and down like a chicken and flap your arms.&nbsp;</div><div>|</div><div>Also, look in the dictionary for the word gullible, because it isn\'t there.</div></div>'),(2,'Fibula Spear','<div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div>The great and powerful Fibula Spear. A most precious possession that has been handed down from father to son in my family for many generations. To think that it would come to this, however; that I would die alone from this terrible illness, with no heir - not even a daughter - to hand the spear over to when I have gone from this world.&nbsp;<div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><span style=\"font-size: 10px;\">|</span><br><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div>The doctors said I don\'t have much longer to live, so while I draw my last breath I give to ye, dear stranger, a clue - a hint, if you may - of where I stowed away my beloved spear. It is unfortunate that I cannot pass it on to a son of mine, but I think my spirit will be satisfied knowing that it\'ll soon be in the hands of a brave, strong and true warrior. Because where I hid it, friend... you better most certainly hope you that are.</div><div><br></div><div><br></div><div><br></div><div><br></div><div><br></div><div><span style=\"font-size: 10px;\">|</span></div></div><div><span style=\"font-size: 10px;\"><br></span></div><div><font size=\"1\">\"Liquefied Magenta in your grasp,</font></div><div><font size=\"1\">Surely, it will aid you in your task</font></div><div><font size=\"1\">Find the lonely, weeping asp,</font></div><div><font size=\"1\">And pour the lilac for a dismal gasp,</font></div><div><font size=\"1\"><br></font></div><div><font size=\"1\">The gasp will unlock, so hear me now,</font></div><div><font size=\"1\">An egress of death that will endow,</font></div><div><font size=\"1\">Upon you a partisan as broad as bough,</font></div><div><font size=\"1\">There\'s death, doom and glory ahead; that I vow.</font></div><div><font size=\"1\"><br></font></div><div><font size=\"1\">--Elenor, G. Dragonswell</font></div>'),(4,'Fake Spellbook','<font size=\"6\">D - o - g. That\'s how you spell dog.&nbsp;</font><div><br></div><div>|<br><div><br></div><div><font size=\"6\">C - a - t. That\'s how you spell cat.</font></div><div><br></div><div>|</div><div><br></div><div><font size=\"6\">G - o - a - t. That\'s how you spell goat.</font></div><div><br></div><div>|</div><div><br></div><div><font size=\"6\">F - i - s - h. That\'s how you spell fish.</font></div><div><br></div><div>|</div><div><br></div><div><font size=\"6\">C - o - w. That\'s how you spell cow.</font></div><div><br></div><div>|</div><div><br></div><div><font size=\"6\">P - i - g. That\'s how you spell pig.</font></div></div><div><br></div><div>|</div><div><br></div><div><font size=\"6\">The end</font></div>'),(5,'Mari-Ann\'s Diary','Dear Diary,<div><br></div><div>Today marks the anniversary of the death of my husband. During these last three years I\'ve slowly come to terms with it - the fact that my dearly beloved was torn away from me in that horrible accident - and in overall I am fine. Most of the time, anyway. However, around every time of this day of the year I find myself sobbing and yelling out for him at night; I just miss him so much.&nbsp;</div><div><br></div><div>But the pain will pass. As always. The thoughts and images that flash through my head at night will dissipate. I must be strong - for both mine and our son\'s sake.</div><div><br></div><div>|</div><div><br></div><div>Dear Diary,</div><div><br></div><div>My son had to wake me last night for I was screaming in my sleep. I frequently have the same nightmare over and over, and I always wake up weeping, but this time it was different, though; I haven\'t felt such dread and hopelessness over the dream since the first days after my husband passed away. It took a while before my son could calm me down from hysteric sobbing, but after playing on that flute of his, I felt a lot better. It never fails cheering me up. I feel so ashamed over the fact that my 9 year old so has to be the one comforting me more often that it is the other way around.&nbsp;</div><div><br></div><div>|</div><div><br></div><div>Dear Diary,</div><div><br></div><div>I\'m watching my son through the window as I\'m writing this. He climbed a tree and is sitting perched on top of one of the branches, playing the flute again. Oh, boy... I think he treasures that flute more than anything else in the whole world. If it wasn\'t for the fact that I cook for him, he\'d probably never come in the house (and forget who I am, for that matter!). Yes, he spends almost every single day outside, laying around in the grass, or on a rock, or hanging from a tree branch - always playing his flute. I can\'t say I blame him for having such attachment to it; after all, it was his father\'s flute.&nbsp;</div><div><br></div><div>|</div><div><br></div><div>Dear Diary,</div><div><br></div><div>My son came to me last night and told me the most peculiar thing;</div>');
/*!40000 ALTER TABLE `ib_books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ib_characters`
--

DROP TABLE IF EXISTS `ib_characters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ib_characters` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `x` int(10) NOT NULL DEFAULT '-8',
  `y` int(10) NOT NULL DEFAULT '1',
  `z` int(10) NOT NULL DEFAULT '-14',
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
  `heartpieces` text,
  `creationtime` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ib_characters`
--

LOCK TABLES `ib_characters` WRITE;
/*!40000 ALTER TABLE `ib_characters` DISABLE KEYS */;
INSERT INTO `ib_characters` VALUES (1,'Yubdei',-8,1,-14,3,20,0,0,1,0,270,1.00,1003,1009,1004,NULL,1368249963);
/*!40000 ALTER TABLE `ib_characters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum_cats`
--

DROP TABLE IF EXISTS `forum_cats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `forum_cats` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `order` int(20) NOT NULL,
  `modonly` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_cats`
--

LOCK TABLES `forum_cats` WRITE;
/*!40000 ALTER TABLE `forum_cats` DISABLE KEYS */;
INSERT INTO `forum_cats` VALUES (1,'General',3,0),(2,'Announcements',1,0),(4,'Ironbane Team',2,1);
/*!40000 ALTER TABLE `forum_cats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ib_items`
--

DROP TABLE IF EXISTS `ib_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ib_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `template` int(10) unsigned NOT NULL DEFAULT '0',
  `attr1` smallint(4) NOT NULL DEFAULT '0',
  `owner` int(10) NOT NULL DEFAULT '0',
  `equipped` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `slot` tinyint(2) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6622 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ib_items`
--

LOCK TABLES `ib_items` WRITE;
/*!40000 ALTER TABLE `ib_items` DISABLE KEYS */;
INSERT INTO `ib_items` VALUES (2,1,2,1,0,0),(2597,5,2,145,0,1),(17,1,2,3,0,0),(9,1,2,4,1,0),(11,1,2,5,1,0),(14,1,2,6,1,0),(16,1,2,7,1,0),(22,1,2,8,1,0),(21,1,2,9,1,0),(26,1,2,11,0,0),(28,1,2,12,1,0),(52,1,2,23,1,0),(146,1,2,52,1,0),(6584,1,2,15,1,0),(40,1,2,16,1,0),(43,1,2,18,1,0),(111,1,2,42,1,0),(47,1,2,20,1,0),(169,1,2,21,0,0),(104,1,2,39,1,0),(101,8,3,27,1,1),(100,1,2,27,0,0),(62,1,2,28,0,0),(64,1,2,29,1,0),(70,1,2,30,1,0),(74,1,2,31,1,0),(6204,1,2,32,1,0),(1916,1,2,139,1,0),(77,1,2,34,1,0),(4335,1,2,167,1,0),(6621,52,1601,162,0,2),(90,1,2,35,1,0),(91,5,2,35,1,2),(94,1,2,36,1,0),(99,1,2,38,1,0),(1558,16,5,136,0,4),(168,10,2,21,0,1),(167,21,3,21,1,2),(127,1,2,43,1,0),(129,1,2,44,1,0),(131,1,2,45,1,0),(133,1,2,46,1,0),(137,1,2,48,1,0),(3137,15,2,158,0,2),(141,1,2,50,1,0),(152,1,2,55,1,0),(155,1,2,56,1,0),(157,1,2,57,1,0),(1557,20,8,136,1,3),(160,1,2,59,0,0),(163,1,2,60,1,0),(171,1,2,61,1,0),(175,1,2,64,1,0),(201,1,2,65,0,0),(202,5,2,65,0,1),(203,1,2,65,1,2),(224,1,2,66,1,0),(226,1,2,67,1,0),(234,1,2,71,1,0),(246,1,2,77,0,0),(249,1,2,78,1,0),(3136,15,2,158,0,1),(349,1,2,83,1,0),(6605,52,1601,117,0,8),(264,1,2,81,1,0),(6620,1,2,162,1,1),(307,1,2,85,1,0),(351,1,2,96,1,0),(641,1,2,97,0,2),(322,1,2,92,1,0),(6270,8,3,125,1,1),(2714,23,4,133,1,6),(1064,20,8,134,0,1),(1063,19,12,134,0,0),(640,5,2,97,1,1),(1062,6,6,131,1,2),(6385,1,2,219,1,0),(388,1,2,101,1,0),(383,1,2,98,1,0),(1061,10,2,131,1,1),(478,1,2,115,1,0),(6269,1,2,125,0,0),(2596,1,2,145,1,0),(639,1,2,97,1,0),(6384,1,2,218,0,0),(6615,1,2,266,1,0),(6614,18,4,128,1,9),(4086,1,2,166,1,0),(6169,1,2,173,0,3),(5316,1,2,174,1,0),(6613,19,12,128,1,8),(6612,26,1,128,1,1),(656,1,2,127,1,0),(2606,14,0,147,0,0),(3135,1,2,158,1,0),(6386,1,2,220,0,0),(6361,6,6,187,1,3),(6611,33,8,128,0,0),(6168,5,2,173,1,1),(1653,1,2,138,1,0),(6604,23,16,117,0,1),(6603,11,2,117,0,3),(6602,27,5,117,0,0),(6601,55,6,117,0,9),(6600,65,10,117,0,4),(1065,25,2,134,0,2),(1060,1,2,131,0,0),(6610,7,4,128,1,2),(1300,15,2,135,0,2),(1299,19,12,135,1,1),(1298,10,2,135,1,0),(1117,1,2,137,1,0),(2713,19,12,133,1,0),(2712,25,2,133,0,1),(2711,16,5,133,0,4),(3494,21,3,132,0,0),(1556,19,12,136,1,2),(1555,8,1,136,1,0),(1554,15,2,136,0,1),(1297,20,8,135,0,4),(1296,25,2,135,0,3),(6599,64,2,117,1,2),(6598,49,20,117,1,5),(6081,1,2,181,0,0),(6271,18,4,125,1,2),(6571,29,-4,126,0,6),(6570,23,16,126,0,5),(1988,1,2,140,1,0),(6597,19,12,117,1,6),(1999,1,2,141,1,0),(6569,20,8,126,1,3),(6596,20,8,117,1,7),(2147,1,2,142,1,0),(2467,1,2,143,1,0),(2469,1,2,144,1,0),(2470,1,2,144,0,2),(2471,15,2,144,0,1),(2608,1,2,148,1,0),(6568,18,4,126,1,1),(2922,1,2,149,1,0),(2932,1,2,150,1,0),(2940,1,2,151,1,0),(2943,1,2,152,1,0),(2944,1,2,154,1,0),(3066,1,2,155,1,0),(6567,19,12,126,1,2),(6360,1,2,187,0,2),(6359,15,2,187,0,1),(3224,8,2,159,0,7),(3223,27,4,159,0,1),(3222,1,2,159,1,0),(6358,1,2,187,1,0),(4855,1,2,169,1,0),(4856,27,4,169,0,1),(4964,1,2,170,1,0),(5199,1,2,171,1,0),(5210,1,2,172,1,0),(6167,1,2,173,1,0),(5317,15,2,174,0,1),(5318,1,2,174,0,2),(5319,15,2,174,0,3),(5796,6,6,175,0,6),(5795,19,12,175,1,7),(5794,36,0,175,0,3),(5793,16,20,175,0,8),(5792,27,4,175,1,2),(5791,15,2,175,0,9),(5790,35,7,175,0,1),(5789,7,4,175,1,4),(5788,18,4,175,1,5),(6326,27,4,209,1,3),(6325,1,2,209,0,0),(6166,15,2,173,0,4),(6165,7,4,173,1,5),(6164,8,2,173,0,2),(6163,15,2,173,0,6),(6566,50,1,126,0,8),(6565,23,16,126,1,0),(6564,24,6,126,0,7),(6082,27,4,181,1,3),(6083,1,2,183,1,0),(6619,36,0,162,0,0),(6094,1,2,186,1,0),(6095,15,2,186,0,1),(6096,1,2,189,1,0),(6097,1,2,190,1,0),(6110,1,2,192,1,1),(6109,1,2,192,0,0),(6206,1,2,197,1,0),(6337,1,2,198,1,0),(6170,27,4,200,1,0),(6171,1,2,201,0,0),(6175,1,2,202,1,0),(6176,1,2,203,1,1),(6205,1,2,204,1,0),(6256,1,2,205,1,0),(6257,15,2,205,0,1),(6387,1,2,220,0,1),(6388,1,2,221,1,0),(6389,15,2,221,0,1),(6398,1,2,224,1,0),(6399,27,4,224,0,2),(6400,1,2,224,0,3),(6401,1,2,225,1,0),(6402,6,6,225,1,1),(6403,5,2,225,1,2),(6404,1,2,226,0,0),(6405,1,2,227,1,0),(6406,1,2,227,0,2),(6407,6,6,227,1,1),(6466,1,2,231,0,0),(6467,1,2,232,0,0),(6468,1,2,234,1,0),(6469,1,2,234,0,1),(6554,15,2,249,0,2),(6553,1,2,249,1,0),(6552,1,2,235,1,0),(6476,1,2,236,0,0),(6477,1,2,236,0,1),(6478,5,2,236,1,2),(6479,8,2,236,0,3),(6480,27,4,236,1,4),(6482,1,2,237,1,0),(6483,1,2,237,0,1),(6544,1,2,239,0,0),(6545,1,2,241,0,0),(6572,40,3,126,0,4),(6563,1,2,250,0,0),(6551,1,2,245,1,0),(6550,1,2,243,1,0),(6573,1,2,252,1,0),(6585,1,2,253,1,0),(6592,1,2,254,0,0),(6593,1,2,255,0,0),(6594,1,2,258,0,0),(6595,1,2,259,1,0),(6606,1,2,263,1,0),(6607,1,2,265,1,0),(6608,1,2,265,0,1),(6609,6,6,265,1,2),(6616,1,2,266,0,1),(6617,1,2,267,1,0),(6618,1,2,268,1,0);
/*!40000 ALTER TABLE `ib_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bcs_user_roles`
--

DROP TABLE IF EXISTS `bcs_user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bcs_user_roles` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bcs_user_roles`
--

LOCK TABLES `bcs_user_roles` WRITE;
/*!40000 ALTER TABLE `bcs_user_roles` DISABLE KEYS */;
INSERT INTO `bcs_user_roles` VALUES (415,1),(415,2),(415,3),(415,4),(415,5);
/*!40000 ALTER TABLE `bcs_user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bcs_roles`
--

DROP TABLE IF EXISTS `bcs_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bcs_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bcs_roles`
--

LOCK TABLES `bcs_roles` WRITE;
/*!40000 ALTER TABLE `bcs_roles` DISABLE KEYS */;
INSERT INTO `bcs_roles` VALUES (1,'ADMIN'),(2,'MODERATOR'),(3,'EDITOR'),(4,'GM'),(5,'USER');
/*!40000 ALTER TABLE `bcs_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bcs_pages`
--

DROP TABLE IF EXISTS `bcs_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bcs_pages` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '',
  `content` text NOT NULL,
  `lastupdated` int(20) NOT NULL DEFAULT '0',
  `madeby` varchar(255) NOT NULL DEFAULT '',
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bcs_pages`
--

LOCK TABLES `bcs_pages` WRITE;
/*!40000 ALTER TABLE `bcs_pages` DISABLE KEYS */;
/*!40000 ALTER TABLE `bcs_pages` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bcs_menu`
--

LOCK TABLES `bcs_menu` WRITE;
/*!40000 ALTER TABLE `bcs_menu` DISABLE KEYS */;
INSERT INTO `bcs_menu` VALUES (1,'About','/',1,NULL,NULL),(2,'Play!','/game',3,NULL,NULL),(3,'Forum','/forum',2,NULL,NULL),(4,'Get Involved','/article/get-involved',4,NULL,NULL),(5,'Twitter','https://twitter.com/IronbaneMMO',5,NULL,'_blank'),(6,'Github','https://github.com/ironbane/IronbaneServer/tree/webapi',6,NULL,'_blank');
/*!40000 ALTER TABLE `bcs_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bcs_chat`
--

DROP TABLE IF EXISTS `bcs_chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bcs_chat` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `author` int(10) NOT NULL DEFAULT '0',
  `line` text NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `time` int(10) NOT NULL DEFAULT '0',
  `private_to` varchar(50) NOT NULL,
  `data` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bcs_chat`
--

LOCK TABLES `bcs_chat` WRITE;
/*!40000 ALTER TABLE `bcs_chat` DISABLE KEYS */;
/*!40000 ALTER TABLE `bcs_chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ib_editor_cats`
--

DROP TABLE IF EXISTS `ib_editor_cats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ib_editor_cats` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `range` varchar(255) DEFAULT NULL,
  `limit_x` tinyint(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ib_editor_cats`
--

LOCK TABLES `ib_editor_cats` WRITE;
/*!40000 ALTER TABLE `ib_editor_cats` DISABLE KEYS */;
INSERT INTO `ib_editor_cats` VALUES (1,'Alpha tiles','1-100',10),(2,'Special','1650-1700',10);
/*!40000 ALTER TABLE `ib_editor_cats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ib_team_actions`
--

DROP TABLE IF EXISTS `ib_team_actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ib_team_actions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user` int(10) unsigned DEFAULT NULL,
  `action` text,
  `link` varchar(255) DEFAULT NULL,
  `previous_data` text,
  `time` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ib_team_actions`
--

LOCK TABLES `ib_team_actions` WRITE;
/*!40000 ALTER TABLE `ib_team_actions` DISABLE KEYS */;
/*!40000 ALTER TABLE `ib_team_actions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bcs_users`
--

DROP TABLE IF EXISTS `bcs_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bcs_users` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(30) NOT NULL DEFAULT '',
  `show_email` tinyint(1) NOT NULL DEFAULT '0',
  `gmt` float(2,1) NOT NULL DEFAULT '1.0',
  `reg_date` int(10) NOT NULL DEFAULT '0',
  `forum_avatar` varchar(100) DEFAULT NULL,
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
  `last_page` varchar(255) NOT NULL DEFAULT '',
  `receive_email` tinyint(1) NOT NULL DEFAULT '1',
  `online` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `activationkey` varchar(12) DEFAULT NULL,
  `pending_editor` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `characterUsed` int(10) unsigned NOT NULL DEFAULT '0',
  `banned` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `rep` int(10) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=420 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bcs_users`
--

LOCK TABLES `bcs_users` WRITE;
/*!40000 ALTER TABLE `bcs_users` DISABLE KEYS */;
INSERT INTO `bcs_users` VALUES (415,'warspawn','$2a$10$7wE4Mro17g2Iy98zLMs/N.0DajTEzn7Y7dZe94JxBUbwPlrfe/CIy','bsparks42@gmail.com',0,1.0,1368835045,NULL,'',0,'','','','0',0,'','','',0,'',0,0,'',1,0,'',0,0,0,1),(417,'test','$2a$10$tswqTfCmTEtRIs5v6/OOSOCzVxbVpFk0EjLaoV1HRQ/IOSfUOf9mO','test@test.org',0,1.0,1369031439,NULL,'',0,'','','','0',0,'','','',0,'',0,0,'',1,0,NULL,0,0,0,1),(418,'testing','$2a$10$yFX9zefjZwn34bxN4OyJLu3ShkfVv6kZ8ATWC9cvKzBgQQrAeGqPi','test@test.com',0,1.0,1369031533,NULL,'',0,'','','','0',0,'','','',0,'',0,0,'',1,0,NULL,0,0,0,1),(419,'tester','$2a$10$fsmTpKSF6uGr0ccgJow.2.BxiWok0ZUYymKoOwbmwuF/0mNYWyxU2','test@ing.com',0,1.0,1369430123,NULL,'',0,'','','','0',0,'','','',0,'',0,0,'',1,0,NULL,0,0,0,1);
/*!40000 ALTER TABLE `bcs_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ib_config`
--

DROP TABLE IF EXISTS `ib_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ib_config` (
  `name` varchar(50) DEFAULT NULL,
  `value` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ib_config`
--

LOCK TABLES `ib_config` WRITE;
/*!40000 ALTER TABLE `ib_config` DISABLE KEYS */;
/*!40000 ALTER TABLE `ib_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum_topics`
--

DROP TABLE IF EXISTS `forum_topics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_topics`
--

LOCK TABLES `forum_topics` WRITE;
/*!40000 ALTER TABLE `forum_topics` DISABLE KEYS */;
INSERT INTO `forum_topics` VALUES (1,1,1368504484,0,'',0,0,0,0),(2,1,1368505834,0,'',0,0,0,0),(3,0,0,0,'',0,0,0,0),(4,0,0,0,'',0,0,0,0),(5,0,0,0,'',0,0,0,0),(6,1,0,0,'',0,0,0,0),(7,1,0,0,'',0,0,0,0),(8,1,0,0,'',0,0,0,0),(9,1,0,0,'',0,0,0,0),(10,1,1368688676,0,'',0,0,0,0),(11,7,1369282480,0,'',0,0,0,0),(12,7,1369283069,0,'',0,0,0,0);
/*!40000 ALTER TABLE `forum_topics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum_posts`
--

DROP TABLE IF EXISTS `forum_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `forum_posts` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `user` int(10) NOT NULL DEFAULT '0',
  `time` int(11) NOT NULL DEFAULT '0',
  `topic_id` int(10) NOT NULL DEFAULT '0',
  `lastedit_time` int(20) NOT NULL DEFAULT '0',
  `lastedit_count` int(20) NOT NULL DEFAULT '0',
  `lastedit_author` int(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `topic_id` (`topic_id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_posts`
--

LOCK TABLES `forum_posts` WRITE;
/*!40000 ALTER TABLE `forum_posts` DISABLE KEYS */;
INSERT INTO `forum_posts` VALUES (1,'Testing','testing 123...',1,1368504912,1,0,0,0),(2,'Testing 2','testing [b]123...[/b]',1,1368505299,1,0,0,0),(3,'Testing 3','We\'ve decided to open source Ironbane, so now anyone can work on it easily! The source code is now live on [url=https://github.com/ironbane]GitHub[/url] and you can install and play around with it on your local machine! Be sure to read the Getting Started section on the repositories. If you need help setting things up, let me know!\r\n\r\nIn addition, there is now a reputation system in place for people who help out! Whether it\'s forum posts, bug reports, new content or pull requests you will get rewarded! Read more on the [url=http://ironbane.com/get-involved.php]Get Involved page[/url].',1,1368505505,2,0,0,0),(4,'q3rasd3','blah blah blah work darn it!!!\n\nmore and some [i]italics[/i]...',1,1368688398,9,0,0,0),(5,'Finally it works!','Not a radical release, but a major one due to the amount of bugfixes and editor additions for the team.\n\n[b]v0.1.6 Changelog[/b]\n[list][*]Fixed sprites showing black\n[*]Fixed some lighting artifacts on models\n[*]Fixed most transparency issues with models\n[*]Fixed guests not being able to play again after being killed\n[*]Changed weapon range of melee weapons\n[*]Editor: Added grid snapping (by default enabled)\n[*]Editor: Rotation of models now auto snap to 5 degrees\n[*]Editor: Added option to ignore the bounding box of the adjacent model\n[*]Editor: Fixed models snapping to bad angles when rotating backwards\n[*]Editor: Fixed models not being deleted sometimes\n[*]Editor: Fixed models still having an invisible collision box when deleted\n[*]Editor: Models now have a \'transparent\' field in the database[/list]',1,1368688676,10,0,0,0),(6,'asdf','asdfasdfasdf',415,1369282480,11,0,0,0),(7,'Here we are with more news!','trying out some shiz...\n\n[code]<base href=\"/ironbane\" />[/code]\n\nhey, maybe that will work!',415,1369283069,12,0,0,0),(8,'ok, trying out a reply now','reply blah',415,1369286514,12,0,0,0),(9,'another reply','wooha\n\neat my shorts beyonce [quote]poop[/quote]',415,1369286873,12,0,0,0);
/*!40000 ALTER TABLE `forum_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum_boards`
--

DROP TABLE IF EXISTS `forum_boards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `forum_boards` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `forumcat` int(20) NOT NULL,
  `description` varchar(255) NOT NULL DEFAULT '',
  `moderatable` tinyint(1) NOT NULL DEFAULT '1',
  `order` tinyint(1) NOT NULL DEFAULT '0',
  `mod_only` tinyint(1) NOT NULL DEFAULT '0',
  `icon` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_boards`
--

LOCK TABLES `forum_boards` WRITE;
/*!40000 ALTER TABLE `forum_boards` DISABLE KEYS */;
INSERT INTO `forum_boards` VALUES (1,'General',1,'General discussion about Ironbane.',1,1,0,NULL),(2,'Suggestions',1,'Just thought of something wickedly cool? Surprise us!',1,3,0,NULL),(3,'Support',1,'If you require assistance killing that gigantic boar, feel free to ask here.',1,2,0,NULL),(5,'Bugs',1,'Found something you could annoy a developer with? Report it here!',1,5,0,NULL),(6,'Off-Topic',1,'For all your overly dramatic posts. And humble discussions, too!',1,6,0,NULL),(7,'News',2,'The latest headlines about Ironbane.',0,0,0,'crowned-skull'),(8,'Introductions',1,'Come on, don\'t be shy! Tell us a little about yourself!',1,0,0,NULL),(9,'General',4,'Anything you\'d like to discuss with the team.',0,10,1,NULL),(10,'Story',4,'Discuss things related to Ironbane\'s story.',0,20,1,NULL),(11,'Gameplay',4,'Talk about the different game mechanics, and which you think is cool for the game.',0,30,1,NULL),(12,'Using the editors',4,'Ask any questions you have on game commands, the level editor, the content editor and others.',1,40,1,NULL),(13,'Editor suggestions/bugs',4,'Discuss things you think would be nice to have, or a nasty bug you found.',1,50,1,NULL),(15,'Graphics',4,'For our beloved artists, talk about pixels, sprites, art and a lot more.',1,35,0,NULL),(16,'Changelog',4,'New versions with their changelog will be posted here for the sake of awesomeness',1,5,1,NULL);
/*!40000 ALTER TABLE `forum_boards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ib_zones`
--

DROP TABLE IF EXISTS `ib_zones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ib_zones` (
  `id` smallint(4) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` tinyint(3) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ib_zones`
--

LOCK TABLES `ib_zones` WRITE;
/*!40000 ALTER TABLE `ib_zones` DISABLE KEYS */;
INSERT INTO `ib_zones` VALUES (1,'World',1),(2,'Developer\'s Zone',2),(3,'Tutorial',2),(4,'Ironbane\'s Castle',2),(6,'Bunny Hole',2),(5,'Ironbane\'s Chamber',2),(7,'Underwater River',2),(8,'Catacombs',2),(10,'Heart Dungeon',2),(9,'Cave',2);
/*!40000 ALTER TABLE `ib_zones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ib_gameobjects`
--

DROP TABLE IF EXISTS `ib_gameobjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ib_gameobjects` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `type` tinyint(2) unsigned NOT NULL,
  `param` smallint(4) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ib_gameobjects`
--

LOCK TABLES `ib_gameobjects` WRITE;
/*!40000 ALTER TABLE `ib_gameobjects` DISABLE KEYS */;
INSERT INTO `ib_gameobjects` VALUES (1,'Test',3,1),(6,'Bush_Symetrical',3,6);
/*!40000 ALTER TABLE `ib_gameobjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ib_units`
--

DROP TABLE IF EXISTS `ib_units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=MyISAM AUTO_INCREMENT=1821 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ib_units`
--

LOCK TABLES `ib_units` WRITE;
/*!40000 ALTER TABLE `ib_units` DISABLE KEYS */;
INSERT INTO `ib_units` VALUES (1013,-174,1,75,1,10,NULL,5,'{\"loot\":\"100:47;80:47;30:47;30:47:20:47\",\"respawnTime\":360,\"rotY\":10}'),(328,206,1,-134,1,9,NULL,2,'{\"text\":\"WARNING!\",\"fontSize\":30,\"rotY\":181}'),(1004,-174,1,10,1,38,NULL,0,'null'),(1005,-157,0,24,1,38,NULL,0,'null'),(1006,-160,0,28,1,38,NULL,0,'null'),(1007,-160,0,71,1,38,NULL,0,'null'),(1008,-165,1,66,1,38,NULL,0,'null'),(6,39,10,-43,2,8,NULL,0,'null'),(1012,-166,0,89,1,38,NULL,0,'null'),(148,-40,0,-27,1,10,NULL,1,'{\"loot\":\"100:8\",\"respawnTime\":300}'),(234,-10,0,-15,1,9,NULL,2,'{\"text\":\"The Grunting|Hog\",\"fontSize\":20,\"rotY\":180}'),(563,-7,0,-7,3,9,NULL,2,'{\"text\":\"Use W-A-S-D|to move\",\"fontSize\":20,\"rotY\":179}'),(13,35,10,-41,2,8,NULL,0,'null'),(959,-172,1,127,1,38,NULL,0,'null'),(960,-224,1,76,1,44,NULL,0,'null'),(961,-222,1,68,1,44,NULL,0,'null'),(16,45,0,-62,2,7,NULL,0,'null'),(1010,-177,1,72,1,38,NULL,0,'null'),(708,-66,0,250,1,38,NULL,0,'null'),(1011,-178,1,83,1,38,NULL,0,'null'),(239,131,1,40,1,38,NULL,0,'null'),(235,11,1,-6,2,10,NULL,13,'{\"loot\":\"100:16;100:16;100:16;100:16;100:16\",\"respawnTime\":30}'),(570,17,0,19,3,10,NULL,13,'{\"loot\":\"100:1\",\"respawnTime\":30,\"rotY\":90}'),(565,-13,0,21,3,9,NULL,2,'{\"text\":\"Use Spacebar|to jump\",\"fontSize\":20,\"rotY\":182}'),(819,133,1,-14,1,52,NULL,0,'null'),(822,315,1,44,1,52,NULL,0,'null'),(837,335,1,62,1,30,NULL,0,'null'),(107,-3,1,12,2,10,NULL,1,'{\"loot\":\"3\",\"respawnTime\":300}'),(1009,-172,1,66,1,38,NULL,0,'null'),(996,-232,0,29,1,38,NULL,0,'null'),(997,-233,0,26,1,44,NULL,0,'null'),(998,-219,5,-8,1,44,NULL,0,'null'),(999,-221,5,-8,1,41,NULL,0,'null'),(1000,-218,5,-5,1,41,NULL,0,'null'),(1001,-190,0,4,1,44,NULL,0,'null'),(1002,-196,0,1,1,44,NULL,0,'null'),(962,-241,0,62,1,44,NULL,0,'null'),(963,-241,0,54,1,44,NULL,0,'null'),(1020,-248,1,93,1,42,NULL,0,'null'),(1003,-181,0,8,1,38,NULL,0,'null'),(948,-147,0,157,1,38,NULL,0,'null'),(949,-139,0,158,1,38,NULL,0,'null'),(950,-124,0,156,1,38,NULL,0,'null'),(951,-115,0,155,1,38,NULL,0,'null'),(953,-149,1,182,1,41,NULL,0,'null'),(954,-147,1,186,1,41,NULL,0,'null'),(955,-150,1,184,1,38,NULL,0,'null'),(709,-73,0,242,1,38,NULL,0,'null'),(710,-80,1,236,1,38,NULL,0,'null'),(711,-80,1,230,1,38,NULL,0,'null'),(712,-151,1,393,1,10,NULL,13,'{\"loot\":\"100:9\",\"respawnTime\":3600,\"rotY\":87}'),(713,-148,1,405,1,1,NULL,0,'null'),(714,-148,1,401,1,1,NULL,0,'null'),(715,-146,1,404,1,1,NULL,0,'null'),(1404,76,1,-196,1,38,28,0,'null'),(719,123,0,-168,1,38,NULL,0,'null'),(1403,126,0,-164,1,38,358,0,'null'),(1401,110,0,-151,1,38,333,0,'null'),(1409,67,0,-142,1,38,100,0,'null'),(1407,66,0,-131,1,38,151,0,'null'),(1408,62,0,-133,1,38,94,0,'null'),(728,105,5,-64,1,38,NULL,0,'null'),(729,100,6,-65,1,38,NULL,0,'null'),(730,94,5,-60,1,38,NULL,0,'null'),(852,343,1,28,1,30,NULL,0,'null'),(732,286,1,29,1,10,NULL,2,'{\"loot\":\"100:11\",\"respawnTime\":6000,\"rotY\":1}'),(783,-54,2,-186,1,38,NULL,0,'null'),(784,-47,2,-188,1,38,NULL,0,'null'),(366,-245,1,96,1,42,NULL,0,'null'),(367,-252,1,93,1,42,NULL,0,'null'),(368,-248,1,86,1,42,NULL,0,'null'),(369,-248,1,106,1,42,NULL,0,'null'),(370,-244,1,110,1,42,NULL,0,'null'),(737,301,1,20,1,10,NULL,43,'{\"loot\":\"100:11;\",\"respawnTime\":6000,\"rotY\":269}'),(384,-21,0,-21,1,40,NULL,0,'null'),(388,-101,0,102,1,38,NULL,0,'null'),(389,-97,0,91,1,38,NULL,0,'null'),(390,-103,0,73,1,38,NULL,0,'null'),(391,-113,0,65,1,38,NULL,0,'null'),(392,-142,0,89,1,38,NULL,0,'null'),(393,-133,0,78,1,38,NULL,0,'null'),(707,-60,1,243,1,38,NULL,0,'null'),(706,-51,0,241,1,38,NULL,0,'null'),(705,-128,1,246,1,41,NULL,0,'null'),(704,-124,1,244,1,41,NULL,0,'null'),(696,-164,0,251,1,9,NULL,1,'{\"text\":\"To Forest of Essence\",\"fontSize\":20,\"rotY\":343}'),(692,14,0,-82,1,10,NULL,3,'{\"loot\":\"100:18;100:19;100:20;100:23 \",\"respawnTime\":1,\"rotY\":186}'),(818,129,1,15,1,38,NULL,0,'null'),(828,294,1,73,1,32,NULL,0,'null'),(701,-118,1,235,1,42,NULL,0,'null'),(1402,123,0,-160,1,38,80,0,'null'),(703,-120,0,242,1,41,NULL,0,'null'),(584,14,0,34,3,9,NULL,2,'{\"text\":\"Attack the|evil slimes!\",\"fontSize\":20,\"rotY\":183}'),(835,317,1,85,1,30,NULL,0,'null'),(834,309,1,86,1,30,NULL,0,'null'),(747,15,0,49,3,38,NULL,0,'null'),(488,420,0,18,1,9,NULL,1,'{\"text\":\"To Mt. Curisp\",\"fontSize\":20,\"rotY\":222}'),(851,353,1,39,1,30,NULL,0,'null'),(702,-117,1,236,1,42,NULL,0,'null'),(836,335,1,57,1,30,NULL,0,'null'),(824,313,1,86,1,32,NULL,0,'null'),(574,15,0,15,3,9,NULL,2,'{\"text\":\"Get the sword|from the chest\",\"fontSize\":20,\"rotY\":314}'),(542,33,2,3,1,9,NULL,2,'{\"text\":\"William the Blacksmith\",\"fontSize\":15,\"rotY\":358}'),(829,289,1,68,1,30,NULL,0,'null'),(544,10,0,78,1,48,NULL,0,'null'),(582,17,0,26,3,9,NULL,2,'{\"text\":\"Equip it!\",\"fontSize\":20,\"rotY\":360}'),(1175,-237,0,159,1,42,NULL,0,'null'),(826,285,1,92,1,32,NULL,0,'null'),(827,298,1,84,1,32,NULL,0,'null'),(825,302,1,94,1,32,NULL,0,'null'),(333,241,3,48,1,1,NULL,0,'null'),(957,-130,1,192,1,10,NULL,13,'{\"loot\":\"5:18;20:8\",\"respawnTime\":250,\"rotY\":86}'),(947,-156,0,156,1,38,NULL,0,'null'),(340,231,3,22,1,38,NULL,0,'null'),(934,37,4,-11,1,10,NULL,13,'{\"loot\":\"\",\"respawnTime\":300,\"rotY\":3}'),(939,-30,0,85,1,10,NULL,13,'{\"loot\":\"100:45;30:7\",\"respawnTime\":500,\"rotY\":91}'),(930,0,0,0,1,8,NULL,0,'{\"invisible\":true}'),(933,35,4,-11,1,10,NULL,13,'{\"loot\":\"\",\"respawnTime\":300,\"rotY\":269}'),(348,236,1,16,1,38,NULL,0,'null'),(958,-169,0,132,1,38,NULL,0,'null'),(365,238,3,33,1,38,NULL,0,'null'),(892,273,5,-154,1,32,NULL,0,'null'),(352,234,1,16,1,38,NULL,0,'null'),(893,274,5,-144,1,32,NULL,0,'null'),(1767,-4,2,66,3,4,NULL,40,'{\"movementType\":2,\"speedMultiplier\":1,\"distanceMultiplier\":1,\"rotY\":180}'),(1067,-79,17,-139,4,10,NULL,13,'{\"loot\":\"100:50\",\"respawnTime\":300,\"rotY\":272}'),(1069,80,2,-145,4,8,NULL,0,'null'),(785,-41,2,-193,1,38,NULL,0,'null'),(786,-44,2,-204,1,38,NULL,0,'null'),(787,-35,1,-194,1,38,NULL,0,'null'),(855,304,1,20,1,32,NULL,0,'null'),(797,-20,0,30,2,47,NULL,0,'null'),(1309,298,1,-448,1,44,19,0,'null'),(794,-131,0,-581,1,9,NULL,1,'{\"text\":\"Ironbane\'s Castle\",\"fontSize\":20,\"rotY\":179}'),(804,313,1,57,1,30,NULL,0,'null'),(805,294,1,-4,1,30,NULL,0,'null'),(806,304,1,-4,1,30,NULL,0,'null'),(807,315,1,-4,1,30,NULL,0,'null'),(833,285,1,94,1,30,NULL,0,'null'),(812,-35,4,56,1,10,NULL,38,'{\"loot\":\"100:5;20:8\",\"respawnTime\":2000,\"rotY\":268}'),(815,42,7,23,1,47,NULL,0,'null'),(830,286,1,66,1,30,NULL,0,'null'),(831,296,1,73,1,30,NULL,0,'null'),(832,300,1,79,1,30,NULL,0,'null'),(326,104,1,15,1,38,NULL,0,'null'),(1271,0,1,-183,4,7,NULL,0,'{\"targetExit\":1270}'),(1272,286,1,-472,1,9,NULL,2,'{\"text\":\"Churchyard | No entry!\",\"fontSize\":18,\"rotY\":100}'),(854,337,1,12,1,30,NULL,0,'null'),(853,335,1,17,1,30,NULL,0,'null'),(845,338,1,105,1,32,NULL,0,'null'),(846,335,1,102,1,32,NULL,0,'null'),(844,342,1,104,1,32,NULL,0,'null'),(848,323,1,-19,1,9,NULL,2,'{\"text\":\"BEWARE! | DO NOT GO ALONE!\",\"fontSize\":14,\"rotY\":182}'),(849,338,1,35,1,30,NULL,0,'null'),(850,351,1,57,1,30,NULL,0,'null'),(1174,-240,0,166,1,42,NULL,0,'null'),(1183,163,15,23,1,9,NULL,2,'{\"text\":\"R.I.P James | Hero from a different time\",\"fontSize\":13,\"rotY\":279}'),(327,103,1,16,1,38,NULL,0,'null'),(1014,-175,1,75,1,10,NULL,5,'{\"loot\":\"100:40;80:40;70:40;30:40;30:40\",\"respawnTime\":360,\"rotY\":356}'),(1017,-174,1,75,1,10,NULL,42,'{\"loot\":\"100:40;80:40;40:40;30:40;29:40\",\"respawnTime\":360,\"rotY\":4}'),(1018,-146,0,-15,1,38,NULL,0,'null'),(1019,-143,0,-14,1,38,NULL,0,'null'),(1177,-217,0,158,1,41,NULL,0,'null'),(1022,-182,20,36,1,10,NULL,13,'{\"loot\":\"80:16;20:10;90:42;5:38\",\"respawnTime\":1600,\"rotY\":22}'),(1028,-207,15,50,1,42,NULL,0,'null'),(1027,-210,15,48,1,42,NULL,0,'null'),(1026,-210,15,49,1,42,NULL,0,'null'),(1029,-207,15,48,1,41,NULL,0,'null'),(1030,-118,0,-75,1,38,NULL,0,'null'),(1031,-122,0,-76,1,38,NULL,0,'null'),(1032,-127,0,-74,1,44,NULL,0,'null'),(1033,-36,0,-130,1,38,NULL,0,'null'),(1034,-41,0,-150,1,38,NULL,0,'null'),(1035,-41,0,-155,1,38,NULL,0,'null'),(1755,-75,4,-211,1,41,267,0,'null'),(1038,-92,0,-292,1,1,NULL,0,'null'),(1343,-133,0,-439,1,41,220,0,'null'),(1040,-75,0,-299,1,38,NULL,0,'null'),(1041,-76,0,-302,1,38,NULL,0,'null'),(1042,-79,0,-300,1,38,NULL,0,'null'),(1043,-90,0,-349,1,52,NULL,0,'null'),(1044,-85,0,-355,1,52,NULL,0,'null'),(1045,-85,0,-373,1,52,NULL,0,'null'),(1046,-83,0,-365,1,42,NULL,0,'null'),(1047,-88,0,-349,1,42,NULL,0,'null'),(1048,-106,0,-402,1,32,NULL,0,'null'),(1049,-106,0,-402,1,30,NULL,0,'null'),(1050,-172,10,-336,1,30,NULL,0,'null'),(1051,-171,9,-321,1,30,NULL,0,'null'),(1052,-162,9,-317,1,30,NULL,0,'null'),(1053,-153,8,-320,1,30,NULL,0,'null'),(1054,-149,8,-328,1,30,NULL,0,'null'),(1055,-150,9,-335,1,30,NULL,0,'null'),(1056,-155,9,-341,1,30,NULL,0,'null'),(1057,-166,10,-343,1,30,NULL,0,'null'),(1058,-172,10,-333,1,30,NULL,0,'null'),(1059,-171,9,-321,1,30,NULL,0,'null'),(1060,-162,10,-327,1,55,NULL,0,'null'),(1073,98,9,-159,4,8,NULL,0,'null'),(1072,32,2,-151,4,7,NULL,0,'{\"targetExit\":1069}'),(1074,80,2,-137,4,7,NULL,0,'{\"targetExit\":1073}'),(1078,144,0,1,1,9,NULL,2,'{\"text\":\"Quick Path | to the | Graveyard! | Very Dangerous!\",\"fontSize\":12,\"rotY\":278}'),(1249,78,9,-126,4,8,NULL,0,'null'),(1242,-35,0,-35,3,5,NULL,68,'{\"movementType\":3,\"speedMultiplier\":1,\"distanceMultiplier\":1,\"rotY\":360,\"startOpen\":false}'),(1243,-35,0,-24,3,69,267,0,'null'),(1173,-242,0,166,1,65,NULL,0,'null'),(1168,0,1,-190,4,7,NULL,0,'{\"targetExit\":1167}'),(1270,-26,1,0,5,8,NULL,0,'null'),(1244,-41,0,-25,3,70,194,0,'null'),(1245,-45,0,-22,3,70,247,0,'null'),(1246,-43,0,-15,3,70,26,0,'null'),(1247,-33,0,-21,3,70,30,0,'null'),(1248,-28,0,-24,3,70,345,0,'null'),(1805,6,7,-2,8,7,NULL,0,'{\"targetExit\":1803,\"invisible\":false}'),(1209,64,1,-107,4,4,NULL,40,'{\"movementType\":1,\"speedMultiplier\":1,\"distanceMultiplier\":2,\"rotY\":359}'),(1208,56,1,-111,4,4,NULL,40,'{\"movementType\":1,\"speedMultiplier\":1,\"distanceMultiplier\":1,\"rotY\":178}'),(1112,-55,9,-168,4,61,NULL,0,'null'),(1116,-69,9,-168,4,46,NULL,0,'null'),(1255,61,5,-154,4,4,NULL,40,'{\"movementType\":3,\"speedMultiplier\":1,\"distanceMultiplier\":2,\"rotY\":90}'),(1231,79,6,-117,4,4,NULL,40,'{\"movementType\":5,\"speedMultiplier\":1,\"distanceMultiplier\":1.8,\"rotY\":90}'),(1223,70,4,-111,4,4,NULL,40,'{\"movementType\":2,\"speedMultiplier\":1.5,\"distanceMultiplier\":2,\"rotY\":180}'),(1224,78,7,-111,4,4,NULL,40,'{\"movementType\":1,\"speedMultiplier\":0.5,\"distanceMultiplier\":3,\"rotY\":180}'),(1234,63,4,-118,4,4,NULL,40,'{\"movementType\":1,\"speedMultiplier\":2,\"distanceMultiplier\":4,\"rotY\":180}'),(1233,72,5,-117,4,4,NULL,40,'{\"movementType\":2,\"speedMultiplier\":2,\"distanceMultiplier\":1,\"rotY\":178}'),(1250,58,1,-127,4,10,NULL,13,'{\"loot\":\"100:52\",\"respawnTime\":300,\"rotY\":179}'),(1154,94,8,-123,4,10,NULL,13,'{\"loot\":\"100:42;100:42;100:15;100:15;75:42;75:15;20:16;25:16\",\"respawnTime\":600,\"rotY\":89}'),(1251,54,1,-127,4,7,NULL,0,'{\"targetExit\":1249}'),(1176,-229,0,153,1,41,NULL,0,'null'),(1178,-210,0,163,1,41,NULL,0,'null'),(1179,-213,1,163,1,42,NULL,0,'null'),(1180,-212,1,170,1,42,NULL,0,'null'),(1184,201,0,113,1,44,NULL,0,'null'),(1185,198,0,109,1,44,NULL,0,'null'),(1186,193,0,103,1,38,NULL,0,'null'),(1187,191,0,95,1,38,NULL,0,'null'),(1188,196,0,91,1,38,NULL,0,'null'),(1189,199,1,82,1,38,NULL,0,'null'),(1190,213,1,73,1,52,NULL,0,'null'),(1798,-30,0,39,3,68,270,0,'null'),(1796,-34,0,42,3,68,269,0,'null'),(1256,66,7,-151,4,4,NULL,40,'{\"movementType\":2,\"speedMultiplier\":1,\"distanceMultiplier\":2,\"rotY\":90}'),(1257,71,10,-154,4,4,NULL,40,'{\"movementType\":3,\"speedMultiplier\":1.5,\"distanceMultiplier\":2,\"rotY\":88}'),(1259,56,12,-147,4,4,NULL,40,'{\"movementType\":3,\"speedMultiplier\":1.5,\"distanceMultiplier\":5,\"rotY\":267}'),(1601,44,9,-145,4,5,NULL,69,'{\"movementType\":3,\"speedMultiplier\":1,\"distanceMultiplier\":2,\"rotY\":179,\"startOpen\":false}'),(1269,-33,0,19,3,9,NULL,2,'{\"text\":\"Kill the|Rat Boss!\",\"fontSize\":20,\"rotY\":8}'),(1277,-11,0,-45,3,9,NULL,2,'{\"text\":\"An evil dragon|awaits you|in his castle\",\"fontSize\":20,\"rotY\":269}'),(1278,6,0,-48,3,9,NULL,2,'{\"text\":\"Do you have|what it takes?\",\"fontSize\":20,\"rotY\":88}'),(1281,13,0,-31,3,5,NULL,54,'{\"movementType\":2,\"speedMultiplier\":1,\"distanceMultiplier\":1,\"rotY\":359,\"startOpen\":false}'),(1282,0,0,-34,3,6,NULL,0,'{\"switchNumber\":1281}'),(1287,1,0,-38,3,9,NULL,2,'{\"text\":\"Will you crack|his evil riddles?\",\"fontSize\":20,\"rotY\":176}'),(1290,22,0,-41,3,9,NULL,2,'{\"text\":\"Will you repel|his minions?\",\"fontSize\":20,\"rotY\":91}'),(1293,19,0,-25,3,9,NULL,2,'{\"text\":\"Then you|are ready.\",\"fontSize\":20,\"rotY\":178}'),(1298,19,0,-8,3,9,NULL,2,'{\"text\":\"to face|Ironbane!\",\"fontSize\":20,\"rotY\":133}'),(1299,16,2,-5,3,7,NULL,0,'{\"targetExit\":930}'),(1300,13,0,46,3,38,270,0,'null'),(1301,-35,0,-46,3,9,NULL,2,'{\"text\":\"You seem to|be worthy.\",\"fontSize\":20,\"rotY\":178}'),(1303,120,13,-425,1,72,161,0,'null'),(1472,96,1,-437,1,5,NULL,40,'{\"movementType\":2,\"speedMultiplier\":1,\"distanceMultiplier\":5,\"rotY\":1,\"startOpen\":false}'),(1308,306,1,-449,1,45,20,0,'null'),(1310,294,1,-449,1,44,26,0,'null'),(1311,291,1,-447,1,44,16,0,'null'),(1312,285,1,-448,1,44,35,0,'null'),(1319,269,1,-446,1,44,165,0,'null'),(1318,275,1,-443,1,44,95,0,'null'),(1316,280,1,-423,1,44,15,0,'null'),(1317,283,1,-417,1,44,228,0,'null'),(1320,265,1,-443,1,44,277,0,'null'),(1344,-136,0,-438,1,41,142,0,'null'),(1345,-138,0,-436,1,42,81,0,'null'),(1347,-114,0,-440,1,9,NULL,1,'{\"text\":\"Beware! | Demon Bunnies\",\"fontSize\":20,\"rotY\":159}'),(1350,-84,0,-436,1,59,165,0,'null'),(1351,-88,0,-438,1,59,209,0,'null'),(1352,-85,0,-434,1,59,253,0,'null'),(1357,-28,1,-466,1,59,114,0,'null'),(1358,-28,1,-469,1,59,111,0,'null'),(1359,-32,1,-469,1,59,168,0,'null'),(1501,4,1,-437,1,59,47,0,'null'),(1499,4,1,-428,1,59,156,0,'null'),(1502,10,1,-442,1,59,338,0,'null'),(1500,-1,1,-433,1,59,54,0,'null'),(1367,-188,0,-443,1,44,17,0,'null'),(1368,-185,0,-442,1,44,320,0,'null'),(1369,-182,0,-434,1,44,349,0,'null'),(1370,-203,0,-449,1,44,118,0,'null'),(1371,-202,0,-456,1,44,107,0,'null'),(1372,-207,0,-462,1,44,99,0,'null'),(1373,-226,0,-512,1,44,3,0,'null'),(1374,-221,0,-518,1,44,96,0,'null'),(1375,-228,0,-522,1,44,138,0,'null'),(1376,-229,0,-522,1,1,335,0,'null'),(1377,-227,0,-513,1,1,335,0,'null'),(1378,-260,1,-613,1,30,184,0,'null'),(1379,-255,0,-599,1,30,255,0,'null'),(1380,-252,3,-586,1,30,272,0,'null'),(1381,-259,0,-575,1,30,190,0,'null'),(1382,-273,1,-581,1,30,192,0,'null'),(1383,-278,1,-579,1,30,229,0,'null'),(1384,-285,1,-570,1,30,243,0,'null'),(1385,-292,1,-560,1,32,287,0,'null'),(1386,-284,1,-586,1,32,42,0,'null'),(1387,-257,0,-599,1,32,27,0,'null'),(1388,-185,0,-568,1,32,36,0,'null'),(1389,-183,0,-575,1,32,27,0,'null'),(1390,-181,0,-576,1,30,319,0,'null'),(1410,65,0,-146,1,38,186,0,'null'),(1400,107,0,-154,1,38,328,0,'null'),(1405,80,1,-194,1,38,155,0,'null'),(1406,75,1,-200,1,38,35,0,'null'),(1411,61,0,-143,1,38,290,0,'null'),(1412,84,0,-153,1,38,4,0,'null'),(1413,115,0,-163,1,52,42,0,'null'),(1417,163,9,-181,1,38,71,0,'null'),(1415,164,9,-185,1,46,13,0,'null'),(1418,166,9,-184,1,38,20,0,'null'),(1419,180,5,-212,1,44,331,0,'null'),(1420,180,5,-212,1,38,331,0,'null'),(1421,217,8,-228,1,44,27,0,'null'),(1422,219,8,-230,1,44,351,0,'null'),(1423,254,0,-228,1,44,281,0,'null'),(1424,256,0,-227,1,44,292,0,'null'),(1425,304,0,-262,1,44,23,0,'null'),(1426,316,2,-257,1,44,47,0,'null'),(1427,321,0,-267,1,38,54,0,'null'),(1428,327,0,-267,1,38,300,0,'null'),(1429,333,2,-254,1,38,281,0,'null'),(1430,304,2,-270,1,52,324,0,'null'),(1431,319,1,-257,1,52,329,0,'null'),(1432,335,1,-261,1,52,82,0,'null'),(1434,359,1,-289,1,9,NULL,2,'{\"text\":\"Tower of | Invisibility\",\"fontSize\":20,\"rotY\":181}'),(1435,363,1,-285,1,57,64,0,'null'),(1436,365,1,-286,1,57,99,0,'null'),(1437,-13,0,19,2,1,247,0,'null'),(1438,-13,0,22,2,32,262,0,'null'),(1439,-15,0,22,2,30,154,0,'null'),(1440,-14,0,23,2,42,81,0,'null'),(1441,-14,0,23,2,42,81,0,'null'),(1446,-15,0,20,2,57,324,0,'null'),(1447,-16,0,19,2,60,296,0,'null'),(1462,-55,1,-337,1,59,78,0,'null'),(1463,-55,1,-335,1,59,113,0,'null'),(1464,-57,0,-337,1,59,99,0,'null'),(1465,-11,1,-307,1,59,38,0,'null'),(1466,-9,1,-308,1,59,40,0,'null'),(1467,-11,1,-308,1,59,73,0,'null'),(1468,-1,1,-318,1,59,94,0,'null'),(1469,0,1,-321,1,59,46,0,'null'),(1470,1,1,-317,1,59,106,0,'null'),(1471,1,1,-321,1,59,152,0,'null'),(1474,118,1,-398,1,6,NULL,0,'{\"switchNumber\":1472}'),(1480,95,1,-430,1,9,NULL,3,'{\"text\":\"~ MRS. ERMA\'S ~ | | | Pull lever down by the river to move lift | | (A necessary safety measure to protect | myself against those pesky bunnies)\",\"fontSize\":17,\"rotY\":89}'),(1481,64,1,-425,1,59,349,0,'null'),(1482,68,1,-424,1,59,27,0,'null'),(1483,64,1,-424,1,59,36,0,'null'),(1484,67,1,-424,1,59,313,0,'null'),(1485,65,1,-423,1,59,118,0,'null'),(1486,90,1,-452,1,59,10,0,'null'),(1487,89,1,-453,1,59,70,0,'null'),(1488,91,1,-455,1,59,300,0,'null'),(1489,93,1,-452,1,59,303,0,'null'),(1498,226,4,-424,1,6,NULL,0,'{\"switchNumber\":1494}'),(1505,-1,15,0,6,8,NULL,0,'null'),(1503,13,1,-437,1,59,250,0,'null'),(1504,8,1,-433,1,59,198,0,'null'),(1494,227,3,-441,1,5,NULL,40,'{\"movementType\":3,\"speedMultiplier\":1,\"distanceMultiplier\":2,\"rotY\":10,\"startOpen\":false}'),(1507,19,2,-425,1,7,NULL,0,'{\"targetExit\":1505}'),(1508,31,7,135,6,73,85,0,'null'),(1509,-9,15,50,6,74,274,0,'null'),(1510,-5,15,52,6,74,276,0,'null'),(1511,-7,15,52,6,59,220,0,'null'),(1512,-10,15,53,6,59,172,0,'null'),(1513,-9,15,49,6,59,136,0,'null'),(1514,-28,15,68,6,59,201,0,'null'),(1515,-27,15,69,6,59,249,0,'null'),(1516,-28,15,70,6,74,164,0,'null'),(1517,-39,15,61,6,74,56,0,'null'),(1518,-14,15,22,6,74,60,0,'null'),(1519,-15,15,23,6,59,60,0,'null'),(1520,-15,15,21,6,59,321,0,'null'),(1521,5,15,29,6,59,295,0,'null'),(1522,5,15,27,6,59,281,0,'null'),(1523,7,15,29,6,59,276,0,'null'),(1524,16,15,56,6,59,290,0,'null'),(1525,14,15,57,6,59,267,0,'null'),(1526,14,15,58,6,59,342,0,'null'),(1527,14,15,58,6,74,342,0,'null'),(1528,35,15,77,6,74,309,0,'null'),(1529,35,15,79,6,74,223,0,'null'),(1530,-24,15,-5,6,59,78,0,'null'),(1531,-25,15,-6,6,59,178,0,'null'),(1532,-26,15,-7,6,59,248,0,'null'),(1533,-33,15,-23,6,59,72,0,'null'),(1534,-33,15,-23,6,74,72,0,'null'),(1535,-33,15,-46,6,74,108,0,'null'),(1536,-34,15,-49,6,74,182,0,'null'),(1537,-32,15,-49,6,59,152,0,'null'),(1538,-33,15,-47,6,59,237,0,'null'),(1539,-1,15,-25,6,59,60,0,'null'),(1540,-1,15,-26,6,59,56,0,'null'),(1541,2,15,-25,6,59,329,0,'null'),(1542,0,15,-27,6,59,305,0,'null'),(1543,23,15,7,6,74,354,0,'null'),(1544,23,15,4,6,74,34,0,'null'),(1545,22,15,5,6,59,34,0,'null'),(1546,24,15,8,6,59,297,0,'null'),(1547,29,15,32,6,59,291,0,'null'),(1548,29,15,32,6,74,332,0,'null'),(1549,46,15,-1,6,74,69,0,'null'),(1550,46,15,0,6,59,73,0,'null'),(1551,49,15,-1,6,59,343,0,'null'),(1552,48,15,-1,6,59,160,0,'null'),(1553,8,15,-58,6,74,281,0,'null'),(1554,8,15,-61,6,74,264,0,'null'),(1555,6,15,-59,6,74,11,0,'null'),(1556,8,15,-60,6,74,203,0,'null'),(1557,-12,15,-66,6,59,131,0,'null'),(1558,-14,15,-64,6,59,36,0,'null'),(1559,-5,15,-93,6,59,280,0,'null'),(1560,-3,15,-89,6,59,321,0,'null'),(1561,0,15,-88,6,59,27,0,'null'),(1562,2,15,-89,6,59,88,0,'null'),(1563,1,15,-94,6,74,162,0,'null'),(1564,-4,15,-91,6,74,303,0,'null'),(1565,-34,15,-114,6,59,106,0,'null'),(1566,-36,15,-117,6,59,168,0,'null'),(1567,19,15,-110,6,74,254,0,'null'),(1568,18,15,-108,6,74,315,0,'null'),(1569,18,15,-108,6,59,290,0,'null'),(1570,37,15,-119,6,59,257,0,'null'),(1571,37,15,-121,6,59,306,0,'null'),(1572,39,15,-119,6,59,282,0,'null'),(1573,37,15,-117,6,59,175,0,'null'),(1574,57,25,2,7,8,NULL,0,'{\"invisible\":true}'),(1575,52,30,16,7,8,NULL,0,'{\"invisible\":true}'),(1576,39,20,15,7,8,NULL,0,'{\"invisible\":true}'),(1577,43,15,8,7,8,NULL,0,'{\"invisible\":true}'),(1578,17,0,147,6,7,NULL,0,'{\"targetExit\":1574}'),(1579,5,0,146,6,7,NULL,0,'{\"targetExit\":1575}'),(1580,0,0,135,6,7,NULL,0,'{\"targetExit\":1576}'),(1581,10,0,134,6,7,NULL,0,'{\"targetExit\":1577}'),(1586,55,13,-153,4,5,NULL,40,'{\"movementType\":3,\"speedMultiplier\":1,\"distanceMultiplier\":4,\"rotY\":271,\"startOpen\":false}'),(1587,46,3,-159,4,6,NULL,0,'{\"switchNumber\":1586}'),(1590,46,1,-150,4,5,NULL,40,'{\"movementType\":2,\"speedMultiplier\":1,\"distanceMultiplier\":7,\"rotY\":178,\"startOpen\":false}'),(1592,-6,18,-108,4,10,NULL,13,'{\"loot\":\"100:53\",\"respawnTime\":800,\"rotY\":359}'),(1671,-3,1,-122,4,62,80,0,'null'),(1672,2,1,-122,4,62,17,0,'null'),(1673,4,1,-127,4,61,175,0,'null'),(1674,-1,1,-127,4,61,172,0,'null'),(1675,-5,1,-127,4,61,184,0,'null'),(1603,13,25,159,6,8,NULL,0,'null'),(1606,51,16,-28,7,8,NULL,0,'{\"invisible\":true}'),(1607,22,0,129,6,7,NULL,0,'{\"targetExit\":1606}'),(1608,53,4,-13,7,8,NULL,0,'{\"invisible\":true}'),(1609,24,0,140,6,7,NULL,0,'{\"targetExit\":1608}'),(1615,24,10,-1,7,8,NULL,0,'{\"invisible\":true}'),(1616,8,11,-1,7,8,NULL,0,'{\"invisible\":true}'),(1617,-7,11,-7,7,8,NULL,0,'{\"invisible\":true}'),(1618,3,0,123,6,7,NULL,0,'{\"targetExit\":1615}'),(1619,1,0,108,6,7,NULL,0,'{\"targetExit\":1616}'),(1620,10,0,90,6,7,NULL,0,'{\"targetExit\":1617}'),(1621,45,20,32,7,8,NULL,0,'{\"invisible\":true}'),(1622,-7,0,144,6,7,NULL,0,'{\"targetExit\":1621}'),(1623,-3,11,21,7,8,NULL,0,'{\"invisible\":true}'),(1624,8,11,25,7,8,NULL,0,'{\"invisible\":true}'),(1625,22,17,29,7,8,NULL,0,'{\"invisible\":true}'),(1626,21,26,39,7,8,NULL,0,'{\"invisible\":true}'),(1627,-4,0,95,6,7,NULL,0,'{\"targetExit\":1623}'),(1628,-11,0,107,6,7,NULL,0,'{\"targetExit\":1624}'),(1629,-13,0,118,6,7,NULL,0,'{\"targetExit\":1625}'),(1630,-24,0,108,6,7,NULL,0,'{\"targetExit\":1626}'),(1631,34,22,40,7,8,NULL,0,'{\"invisible\":true}'),(1633,36,9,26,7,8,NULL,0,'{\"invisible\":true}'),(1634,-23,0,133,6,7,NULL,0,'{\"targetExit\":1631}'),(1635,-12,0,130,6,7,NULL,0,'{\"targetExit\":1633}'),(1637,-101,14,-550,1,8,NULL,0,'null'),(1638,141,14,-46,7,7,NULL,0,'{\"targetExit\":1637}'),(1803,321,2,104,1,8,NULL,0,'{\"invisible\":true}'),(1804,321,2,106,1,7,NULL,0,'{\"targetExit\":1802,\"invisible\":false}'),(1809,-1,10,11,10,4,NULL,40,'{\"movementType\":1,\"speedMultiplier\":1,\"distanceMultiplier\":1,\"rotY\":267}'),(1802,6,6,-3,8,8,NULL,0,'{\"invisible\":true}'),(1676,-25,1,-107,4,61,125,0,'null'),(1677,-27,1,-110,4,61,99,0,'null'),(1678,-27,1,-114,4,61,70,0,'null'),(1679,-24,1,-115,4,61,195,0,'null'),(1680,-23,1,-111,4,62,225,0,'null'),(1681,25,1,-107,4,62,356,0,'null'),(1682,27,1,-108,4,61,288,0,'null'),(1683,27,1,-107,4,61,272,0,'null'),(1684,27,1,-106,4,61,272,0,'null'),(1685,27,1,-105,4,61,272,0,'null'),(1686,-63,2,-135,4,60,69,0,'null'),(1687,-56,2,-148,4,60,141,0,'null'),(1688,-54,9,-169,4,61,41,0,'null'),(1689,-54,9,-172,4,61,66,0,'null'),(1690,-56,9,-171,4,61,16,0,'null'),(1691,-66,9,-166,4,32,160,0,'null'),(1692,-72,9,-166,4,32,33,0,'null'),(1693,49,1,-119,4,57,97,0,'null'),(1694,48,1,-124,4,57,86,0,'null'),(1695,68,1,-130,4,32,358,0,'null'),(1696,72,1,-135,4,32,34,0,'null'),(1697,73,1,-130,4,32,293,0,'null'),(1698,71,1,-125,4,30,235,0,'null'),(1699,68,1,-125,4,30,127,0,'null'),(1700,68,1,-131,4,30,60,0,'null'),(1701,88,1,-130,4,44,337,0,'null'),(1702,92,1,-129,4,38,291,0,'null'),(1703,90,1,-125,4,38,187,0,'null'),(1704,90,1,-142,4,61,5,0,'null'),(1705,94,1,-142,4,61,12,0,'null'),(1706,97,1,-145,4,61,106,0,'null'),(1707,87,1,-144,4,61,256,0,'null'),(1708,92,1,-154,4,62,37,0,'null'),(1709,87,1,-155,4,44,26,0,'null'),(1710,92,1,-155,4,44,299,0,'null'),(1719,0,1,-129,4,5,NULL,70,'{\"movementType\":1,\"speedMultiplier\":2,\"distanceMultiplier\":3,\"rotY\":90,\"startOpen\":false}'),(1720,28,1,-105,4,5,NULL,69,'{\"movementType\":3,\"speedMultiplier\":1,\"distanceMultiplier\":3,\"rotY\":359,\"startOpen\":false}'),(1723,69,1,-149,4,32,209,0,'null'),(1724,71,1,-147,4,32,285,0,'null'),(1725,63,1,-150,4,32,211,0,'null'),(1726,59,1,-149,4,32,147,0,'null'),(1727,60,1,-152,4,57,45,0,'null'),(1728,70,1,-146,4,57,323,0,'null'),(1729,17,17,-162,4,74,123,0,'null'),(1730,17,17,-160,4,74,94,0,'null'),(1731,17,17,-159,4,74,159,0,'null'),(1732,14,17,-160,4,74,109,0,'null'),(1734,17,17,-162,4,74,189,0,'null'),(1735,-15,2,-147,4,60,202,0,'null'),(1736,-13,1,-151,4,60,255,0,'null'),(1737,-15,2,-156,4,60,313,0,'null'),(1738,-10,2,-139,4,60,270,0,'null'),(1739,-45,17,-143,4,62,226,0,'null'),(1740,-44,17,-147,4,61,166,0,'null'),(1741,-49,17,-147,4,61,196,0,'null'),(1742,-44,17,-147,4,61,171,0,'null'),(1754,-75,4,-213,1,41,289,0,'null'),(1773,-4,4,72,3,4,NULL,40,'{\"movementType\":3,\"speedMultiplier\":0.5,\"distanceMultiplier\":1,\"rotY\":179}'),(1774,-10,4,73,3,4,NULL,40,'{\"movementType\":1,\"speedMultiplier\":0.8,\"distanceMultiplier\":2,\"rotY\":270}'),(1777,-37,2,61,3,8,NULL,0,'{\"invisible\":true}'),(1778,-28,3,60,3,7,NULL,0,'{\"targetExit\":1777,\"invisible\":false}'),(1780,-28,3,62,3,9,NULL,3,'{\"text\":\"Good job! | Claim your reward and walk through | the teleport to continue the level!\",\"fontSize\":19,\"rotY\":269}'),(1782,-24,3,60,3,10,NULL,13,'{\"loot\":\"100:6\",\"respawnTime\":600,\"rotY\":181}'),(1784,-23,4,74,3,9,NULL,3,'{\"text\":\"Good job! | Walk through the teleport to | continue the level!\",\"fontSize\":19,\"rotY\":269}'),(1785,-22,4,77,3,7,NULL,0,'{\"targetExit\":1777,\"invisible\":false}'),(1788,-7,0,59,3,9,NULL,1,'{\"text\":\"Boxes too hard? | Go this way!\",\"fontSize\":19,\"rotY\":88}'),(1790,-4,0,53,3,9,NULL,2,'{\"text\":\"Climb Boxes | For Reward\",\"fontSize\":20,\"rotY\":271}'),(1791,0,0,64,3,70,98,0,'null'),(1792,4,0,72,3,70,321,0,'null'),(1795,-37,0,51,3,9,NULL,2,'{\"text\":\"Q - E | to strafe\",\"fontSize\":20,\"rotY\":180}'),(1799,-40,0,34,3,68,360,0,'null'),(1800,-40,0,30,3,68,358,0,'null'),(1801,-23,0,32,3,68,180,0,'null'),(1806,-161,0,-511,1,75,202,0,'null'),(1807,-143,0,-524,1,76,279,0,'null'),(1808,-128,0,-573,1,9,NULL,1,'{\"text\":\"Leslie\'s Plaice\",\"fontSize\":20,\"rotY\":89}'),(1814,-9,1,37,10,5,NULL,32,'{\"movementType\":2,\"speedMultiplier\":2,\"distanceMultiplier\":2,\"rotY\":359,\"startOpen\":false}'),(1815,-22,10,36,10,6,NULL,0,'{\"switchNumber\":1814}'),(1818,-37,2,-39,10,4,NULL,40,'{\"movementType\":2,\"speedMultiplier\":1.1,\"distanceMultiplier\":4,\"rotY\":1}');
/*!40000 ALTER TABLE `ib_units` ENABLE KEYS */;
UNLOCK TABLES;
