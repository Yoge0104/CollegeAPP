-- MySQL Database Setup Script for College Companion App
-- Run this script in MySQL to create the database

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS LoginData 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE LoginData;

-- Grant privileges (optional - if using different user)
-- GRANT ALL PRIVILEGES ON LoginData.* TO 'root'@'localhost';
-- FLUSH PRIVILEGES;

-- Tables will be auto-created by Spring Boot JPA with ddl-auto=update
-- But here are the expected table structures for reference:

/*
Expected Tables:
1. users - User accounts (students, faculty, admin)
2. timetable - Class schedules
3. notes - Study materials
4. doubts - Question forum
5. doubt_replies - Answers to doubts
6. notices - Announcements
*/

-- Verify database creation
SHOW DATABASES;
SELECT 'Database "LoginData" is ready!' AS Status;
