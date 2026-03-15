-- MySQL Initialization Script
-- பருவ உணவு கண்டுபிடிப்பான் Database Setup
-- This runs automatically when MySQL container first starts

CREATE DATABASE IF NOT EXISTS seasonal_foods
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE seasonal_foods;

GRANT ALL PRIVILEGES ON seasonal_foods.* TO 'fooduser'@'%';
FLUSH PRIVILEGES;
