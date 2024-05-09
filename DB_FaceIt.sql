/*
SQLyog Ultimate v12.5.1 (64 bit)
MySQL - 10.4.32-MariaDB : Database - proyek_ws
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`proyek_ws` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `proyek_ws`;

/*Table structure for table `membership` */

DROP TABLE IF EXISTS `membership`;

CREATE TABLE `membership` (
  `id_membership` int(100) NOT NULL AUTO_INCREMENT,
  `nama_membership` varchar(255) NOT NULL,
  `harga_membership` varchar(255) NOT NULL,
  PRIMARY KEY (`id_membership`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `membership` */

/*Table structure for table `user_membership` */

DROP TABLE IF EXISTS `user_membership`;

CREATE TABLE `user_membership` (
  `id_user_membership` int(100) NOT NULL AUTO_INCREMENT,
  `nickname` varchar(255) NOT NULL,
  `id_membership` int(100) NOT NULL,
  PRIMARY KEY (`id_user_membership`),
  KEY `nickname` (`nickname`),
  KEY `id_membership` (`id_membership`),
  CONSTRAINT `id_membership` FOREIGN KEY (`id_membership`) REFERENCES `membership` (`id_membership`),
  CONSTRAINT `nickname` FOREIGN KEY (`nickname`) REFERENCES `users` (`nickname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `user_membership` */

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `nickname` varchar(255) NOT NULL,
  `date_of_birth` varchar(255) NOT NULL,
  `saldo` varchar(255) NOT NULL DEFAULT '0',
  `join_at` varchar(255) NOT NULL,
  PRIMARY KEY (`nickname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `users` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
