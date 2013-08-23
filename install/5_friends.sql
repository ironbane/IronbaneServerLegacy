CREATE TABLE `users_friends` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  `date_added` int(11) NOT NULL,
  `tags` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `friend` (`user_id`,`friend_id`)
);
