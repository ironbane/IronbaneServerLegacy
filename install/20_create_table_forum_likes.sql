CREATE TABLE `forum_posts_likes` (
  `from_user` int(11) NOT NULL,
  `to_post` int(11) NOT NULL,
  PRIMARY KEY (`from_user`,`to_post`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1