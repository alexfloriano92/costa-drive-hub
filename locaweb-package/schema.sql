-- Costa Veículos — schema MySQL
-- Importe este arquivo pelo phpMyAdmin da Locaweb.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `users` (
  `id`            CHAR(36)      NOT NULL,
  `email`         VARCHAR(191)  NOT NULL,
  `password_hash` VARCHAR(255)  NOT NULL,
  `role`          ENUM('admin','user') NOT NULL DEFAULT 'admin',
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `vehicles` (
  `id`           CHAR(36)       NOT NULL,
  `brand`        VARCHAR(100)   NOT NULL,
  `model`        VARCHAR(150)   NOT NULL,
  `year`         SMALLINT       NOT NULL,
  `mileage`      INT            NOT NULL DEFAULT 0,
  `price`        DECIMAL(12,2)  NOT NULL,
  `color`        VARCHAR(60)    NULL,
  `fuel`         VARCHAR(40)    NULL,
  `transmission` VARCHAR(40)    NULL,
  `category`     VARCHAR(20)    NOT NULL DEFAULT 'carro',
  `status`       VARCHAR(20)    NOT NULL DEFAULT 'disponivel',
  `featured`     TINYINT(1)     NOT NULL DEFAULT 0,
  `description`  TEXT           NULL,
  `images`       JSON           NOT NULL,
  `created_at`   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_vehicles_status`   (`status`),
  KEY `idx_vehicles_category` (`category`),
  KEY `idx_vehicles_featured` (`featured`),
  KEY `idx_vehicles_created`  (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
