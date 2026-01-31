-- Create database (if not exists) and users table for Tinker Bell's Garden
-- Run in MySQL/MariaDB client (e.g., via phpMyAdmin, MySQL CLI, or XAMPP's admin)

CREATE DATABASE IF NOT EXISTS `tinker_garden` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `tinker_garden`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
