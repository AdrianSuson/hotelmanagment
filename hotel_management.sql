-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS hotel_management;

-- Use the hotel_management database
USE hotel_management;

-- Create the users table
CREATE TABLE
    IF NOT EXISTS `users` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `userId` VARCHAR(255) NOT NULL UNIQUE,
        `username` VARCHAR(255) NOT NULL UNIQUE,
        `password` VARCHAR(255) NOT NULL,
        `role` VARCHAR(50) NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS `user_profile` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        `user_id` VARCHAR(255) NOT NULL,
        `first_name` VARCHAR(255) NOT NULL,
        `last_name` VARCHAR(255) NOT NULL,
        `email` VARCHAR(255) UNIQUE,
        `phone_number` VARCHAR(15),
        `address` TEXT,
        `image_url` VARCHAR(255) DEFAULT 'default_profile.png',
        FOREIGN KEY (user_id) REFERENCES users (userId)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS `user_log` (
        `log_id` INT AUTO_INCREMENT,
        `user_id` VARCHAR(255) NOT NULL,
        `action` VARCHAR(255) NOT NULL,
        `action_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`log_id`),
        FOREIGN KEY (`user_id`) REFERENCES `users` (`userId`)
    ) ENGINE = InnoDB;

-- Create the room_types table
CREATE TABLE
    IF NOT EXISTS room_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
    );

-- Insert room types into the room_types table
INSERT INTO
    room_types (name)
VALUES
    ('Single Room'),
    ('Double Room');

-- Create the status_codes table
CREATE TABLE
    IF NOT EXISTS status_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(10) NOT NULL UNIQUE,
        label VARCHAR(255) NOT NULL,
        color VARCHAR(7) NOT NULL,
        text_color VARCHAR(7) NOT NULL
    );

-- Insert status codes with color and text color into the status_codes table
INSERT INTO IF NOT EXISTS
    status_codes (code, label, color, text_color)
VALUES
    ('OC', 'Occupied clean', '#00008B', '#FFFFFF'),
    ('OD', 'Occupied dirty', '#FF8C00', '#000000'),
    ('VR', 'Vacant ready', '#006400', '#FFFFFF'),
    ('VC', 'Vacant clean', '#5F9EA0', '#FFFFFF'),
    ('VD', 'Vacant dirty', '#8B0000', '#FFFFFF'),
    ('HSUD', 'House use clean', '#CCCC00', '#000000'),
    ('HSUC', 'House use dirty', '#32CD32', '#000000'),
    ('OOO', 'Out of order', '#808080', '#FFFFFF'),
    ('BLO', 'Blocked', '#4B0082', '#FFFFFF'),
    ('NS', 'No show', '#FFC0CB', '#000000'),
    ('SO', 'Slept out', '#8B4513', '#FFFFFF'),
    ('OT', 'Over Time', '#000000', '#FFFFFF');

-- Create the rooms table
CREATE TABLE
    IF NOT EXISTS rooms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_number VARCHAR(255) NOT NULL,
        room_type_id INT,
        rate DECIMAL(10, 2) NOT NULL,
        imageUrl VARCHAR(255),
        status_code_id INT,
        max_people INT NOT NULL DEFAULT 2,
        FOREIGN KEY (room_type_id) REFERENCES room_types (id),
        FOREIGN KEY (status_code_id) REFERENCES status_codes (id)
    );

-- Create the guests table
CREATE TABLE
    IF NOT EXISTS guests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(15),
        id_picture VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Create the reservations table
CREATE TABLE
    IF NOT EXISTS reservations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_id INT NOT NULL,
        guest_id INT NOT NULL,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        adults INT NOT NULL DEFAULT 1,
        kids INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (room_id) REFERENCES rooms (id),
        FOREIGN KEY (guest_id) REFERENCES guests (id)
    );

-- Create the stay_records table
CREATE TABLE
    IF NOT EXISTS stay_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_id INT NOT NULL,
        guest_id INT NOT NULL,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        adults INT NOT NULL DEFAULT 1,
        kids INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (room_id) REFERENCES rooms (id),
        FOREIGN KEY (guest_id) REFERENCES guests (id)
    );

-- Create the service_list table
CREATE TABLE
    IF NOT EXISTS service_list (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        base_price DECIMAL(10, 2) NOT NULL
    ) ENGINE = InnoDB;

-- Create the discounts table
CREATE TABLE
    IF NOT EXISTS discounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        percentage DECIMAL(5, 2) NOT NULL CHECK (
            percentage >= 0
            AND percentage <= 100
        ),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Create the services table and link it to service_list
CREATE TABLE
    IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        stay_record_id INT NOT NULL,
        service_list_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        FOREIGN KEY (stay_record_id) REFERENCES stay_records (id),
        FOREIGN KEY (service_list_id) REFERENCES service_list (id)
    );

-- Create the stay_records_history table
CREATE TABLE
    IF NOT EXISTS stay_records_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_id INT NOT NULL,
        guest_id INT NOT NULL,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        adults INT NOT NULL DEFAULT 1,
        kids INT NOT NULL DEFAULT 0,
        amount_paid DECIMAL(10, 2) NOT NULL,
        total_service_charges DECIMAL(10, 2) NOT NULL,
        discount_percentage DECIMAL(5, 2) NOT NULL,
        discount_name VARCHAR(255),
        payment_method VARCHAR(50) DEFAULT 'cash',
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (room_id) REFERENCES rooms (id),
        FOREIGN KEY (guest_id) REFERENCES guests (id)
    );

-- Create the about_us table
CREATE TABLE
    IF NOT EXISTS about_us (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE = InnoDB;

-- Create the ads table
CREATE TABLE
    IF NOT EXISTS ads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE = InnoDB;