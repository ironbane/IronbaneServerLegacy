-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Machine: localhost
-- Genereertijd: 10 jun 2013 om 12:42
-- Serverversie: 5.5.24-log
-- PHP-versie: 5.4.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Databank: `ironbane`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `bcs_menu`
--

CREATE TABLE IF NOT EXISTS `bcs_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL DEFAULT 'New Menu Item',
  `path` varchar(255) NOT NULL DEFAULT '/',
  `sort` int(11) NOT NULL DEFAULT '0',
  `security` varchar(255) DEFAULT NULL,
  `target` varchar(45) DEFAULT NULL COMMENT 'default null, do we need _new or _blank or _self ? use thise',
  `options` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

--
-- Gegevens worden uitgevoerd voor tabel `bcs_menu`
--

INSERT INTO `bcs_menu` (`id`, `title`, `path`, `sort`, `security`, `target`, `options`) VALUES
(1, 'About', '/', 1, NULL, NULL, ''),
(2, 'Play!', '/game', 3, NULL, '_self', ''),
(3, 'Forum', '/forum', 2, NULL, NULL, ''),
(4, 'Get Involved', '/article/get-involved', 4, NULL, NULL, ''),
(5, 'Twitter', 'https://twitter.com/IronbaneMMO', 5, NULL, '_blank', ''),
(6, 'Github', 'https://github.com/ironbane/IronbaneServer/tree/webapi', 6, NULL, '_blank', ''),
(7, 'preferences', '/profile', 7, NULL, NULL, 'ng-show="currentUser.authenticated"'),
(8, 'Log In', '/login', 0, NULL, NULL, 'ng-hide="currentUser.authenticated"'),
(9, 'Log Out', '/logout', 0, NULL, '_self', 'ng-show="currentUser.authenticated"'),
(10, 'Editor', '/editor', 0, NULL, NULL, 'ng-show="currentUser.$hasRole(''EDITOR'')"'),
(11, 'Uploads', '/uploads', 0, NULL, NULL, 'ng-show="currentUser.$hasRole(''ADMIN'')"');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
