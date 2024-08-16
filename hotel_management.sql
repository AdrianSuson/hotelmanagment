-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS hotel_management;

-- Use the hotel_management database
USE hotel_management;

--
-- Database: `hotel_management`
--
-- --------------------------------------------------------
--
-- Table structure for table `about_us`
--
CREATE TABLE
  `about_us` (
    `id` int (11) NOT NULL,
    `title` varchar(255) NOT NULL,
    `description` text NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Dumping data for table `about_us`
--
INSERT INTO
  `about_us` (
    `id`,
    `title`,
    `description`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    1,
    'Hotel Management System',
    '',
    '2024-08-01 10:06:38',
    '2024-08-01 10:06:38'
  );

-- --------------------------------------------------------
--
-- Table structure for table `ads`
--
CREATE TABLE
  `ads` (
    `id` int (11) NOT NULL,
    `title` varchar(255) NOT NULL,
    `description` text NOT NULL,
    `image_url` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Dumping data for table `ads`
--
INSERT INTO
  `ads` (
    `id`,
    `title`,
    `description`,
    `image_url`,
    `created_at`,
    `updated_at`
  )
VALUES
  (
    1,
    'front office',
    '',
    '20240802-photo_2024-07-25_15-25-29.jpg',
    '2024-08-02 02:01:26',
    '2024-08-02 02:01:26'
  ),
  (
    2,
    '',
    '',
    '20240802-photo_2024-07-25_15-25-51.jpg',
    '2024-08-02 02:02:20',
    '2024-08-02 02:02:20'
  ),
  (
    3,
    '',
    '',
    '20240802-photo_2024-07-25_15-25-56.jpg',
    '2024-08-02 02:03:54',
    '2024-08-02 02:03:54'
  ),
  (
    4,
    '',
    '',
    '20240802-photo_2024-07-25_15-26-00.jpg',
    '2024-08-02 02:04:04',
    '2024-08-02 02:04:04'
  );

-- --------------------------------------------------------
--
-- Table structure for table `discounts`
--
CREATE TABLE
  `discounts` (
    `id` int (11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `percentage` decimal(5, 2) NOT NULL CHECK (
      `percentage` >= 0
      and `percentage` <= 100
    ),
    `created_at` timestamp NOT NULL DEFAULT current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Dumping data for table `discounts`
--
INSERT INTO
  `discounts` (`id`, `name`, `percentage`, `created_at`)
VALUES
  (1, 'Senior', 20.00, '2024-08-01 11:58:17'),
  (2, 'Promo', 10.00, '2024-08-10 12:03:51');

-- --------------------------------------------------------
--
-- Table structure for table `guests`
--
CREATE TABLE
  `guests` (
    `id` int (11) NOT NULL,
    `first_name` varchar(255) NOT NULL,
    `last_name` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `phone` varchar(15) DEFAULT NULL,
    `id_picture` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Table structure for table `reservations`
--
CREATE TABLE
  `reservations` (
    `id` int (11) NOT NULL,
    `room_id` int (11) NOT NULL,
    `guest_id` int (11) NOT NULL,
    `check_in` date NOT NULL,
    `check_out` date NOT NULL,
    `adults` int (11) NOT NULL DEFAULT 1,
    `kids` int (11) NOT NULL DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Table structure for table `rooms`
--
CREATE TABLE
  `rooms` (
    `id` int (11) NOT NULL,
    `room_number` varchar(255) NOT NULL,
    `room_type_id` int (11) DEFAULT NULL,
    `rate` decimal(10, 2) NOT NULL,
    `imageUrl` varchar(255) DEFAULT NULL,
    `status_code_id` int (11) DEFAULT NULL,
    `max_people` int (11) NOT NULL DEFAULT 2
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Table structure for table `room_types`
--
CREATE TABLE
  `room_types` (
    `id` int (11) NOT NULL,
    `name` varchar(255) NOT NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Dumping data for table `room_types`
--
INSERT INTO
  `room_types` (`id`, `name`)
VALUES
  (2, 'Double Room'),
  (1, 'Single Room');

-- --------------------------------------------------------
--
-- Table structure for table `services`
--
CREATE TABLE
  `services` (
    `id` int (11) NOT NULL,
    `stay_record_id` int (11) NOT NULL,
    `service_list_id` int (11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `price` decimal(10, 2) NOT NULL,
    `description` text DEFAULT NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Table structure for table `service_list`
--
CREATE TABLE
  `service_list` (
    `id` int (11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `description` text DEFAULT NULL,
    `base_price` decimal(10, 2) NOT NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Dumping data for table `service_list`
--
INSERT INTO
  `service_list` (`id`, `name`, `description`, `base_price`)
VALUES
  (1, 'Food', '', 200.00);

-- --------------------------------------------------------
--
-- Table structure for table `status_codes`
--
CREATE TABLE
  `status_codes` (
    `id` int (11) NOT NULL,
    `code` varchar(10) NOT NULL,
    `label` varchar(255) NOT NULL,
    `color` varchar(7) NOT NULL,
    `text_color` varchar(7) NOT NULL
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Dumping data for table `status_codes`
--
INSERT INTO
  `status_codes` (`id`, `code`, `label`, `color`, `text_color`)
VALUES
  (1, 'OC', 'Occupied clean', '#00008B', '#FFFFFF'),
  (2, 'OD', 'Occupied dirty', '#FF8C00', '#000000'),
  (3, 'VR', 'Vacant ready', '#006400', '#FFFFFF'),
  (4, 'VC', 'Vacant clean', '#5F9EA0', '#FFFFFF'),
  (5, 'VD', 'Vacant dirty', '#8B0000', '#FFFFFF'),
  (
    6,
    'HSUD',
    'House use clean',
    '#CCCC00',
    '#000000'
  ),
  (
    7,
    'HSUC',
    'House use dirty',
    '#32CD32',
    '#000000'
  ),
  (8, 'OOO', 'Out of order', '#808080', '#FFFFFF'),
  (9, 'BLO', 'Blocked', '#4B0082', '#FFFFFF'),
  (11, 'SO', 'Slept out', '#8B4513', '#FFFFFF'),
  (12, 'OT', 'Over Time', '#000000', '#FFFFFF'),
  (13, 'NS', 'No show', '#FFC0CB', '#000000');

-- --------------------------------------------------------
--
-- Table structure for table `stay_records`
--
CREATE TABLE
  `stay_records` (
    `id` int (11) NOT NULL,
    `room_id` int (11) NOT NULL,
    `guest_id` int (11) NOT NULL,
    `check_in` date NOT NULL,
    `check_out` date NOT NULL,
    `adults` int (11) NOT NULL DEFAULT 1,
    `kids` int (11) NOT NULL DEFAULT 0,
    `total_rate` decimal(10, 2) NOT NULL,
    `discount_id` int (11) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Table structure for table `stay_records_history`
--
CREATE TABLE
  `stay_records_history` (
    `id` int (11) NOT NULL,
    `room_id` int (11) NOT NULL,
    `guest_id` int (11) NOT NULL,
    `check_in` date NOT NULL,
    `check_out` date NOT NULL,
    `adults` int (11) NOT NULL DEFAULT 1,
    `kids` int (11) NOT NULL DEFAULT 0,
    `amount_paid` decimal(10, 2) NOT NULL,
    `total_service_charges` decimal(10, 2) NOT NULL,
    `discount_percentage` decimal(5, 2) NOT NULL,
    `discount_name` varchar(255) DEFAULT NULL,
    `payment_method` varchar(50) DEFAULT 'cash',
    `payment_date` timestamp NOT NULL DEFAULT current_timestamp(),
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- --------------------------------------------------------
--
-- Table structure for table `users`
--
CREATE TABLE
  `users` (
    `id` int (11) NOT NULL,
    `userId` varchar(255) NOT NULL,
    `username` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `role` varchar(50) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Dumping data for table `users`
--
INSERT INTO
  `users` (
    `id`,
    `userId`,
    `username`,
    `password`,
    `role`,
    `created_at`
  )
VALUES
  (
    1,
    'admin-000000',
    'admin',
    '$2b$10$UwCSO/JBJt22xdgeqZcTt.5O0pUEkpLtjzSxRHSSD8ezGu.k/XugW',
    'admin',
    '2024-08-01 09:47:31'
  ),
  (
    2,
    '123123',
    'staff',
    '$2b$10$T9PWwr3ucOlt2DxKIFQFCuhyihqOGoX.ex3hRzLhZ0v33/YgA.nQa',
    'staff',
    '2024-08-02 01:58:13'
  );

-- --------------------------------------------------------
--
-- Table structure for table `user_log`
--
CREATE TABLE
  `user_log` (
    `log_id` int (11) NOT NULL,
    `user_id` varchar(255) NOT NULL,
    `action` varchar(255) NOT NULL,
    `action_time` timestamp NOT NULL DEFAULT current_timestamp()
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Table structure for table `user_profile`
--
CREATE TABLE
  `user_profile` (
    `id` int (11) NOT NULL,
    `user_id` varchar(255) NOT NULL,
    `first_name` varchar(255) NOT NULL,
    `last_name` varchar(255) NOT NULL,
    `email` varchar(255) DEFAULT NULL,
    `phone_number` varchar(15) DEFAULT NULL,
    `address` text DEFAULT NULL,
    `image_url` varchar(255) DEFAULT 'default_profile.png'
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Dumping data for table `user_profile`
--
INSERT INTO
  `user_profile` (
    `id`,
    `user_id`,
    `first_name`,
    `last_name`,
    `email`,
    `phone_number`,
    `address`,
    `image_url`
  )
VALUES
  (
    1,
    'admin-000000',
    'Admin',
    'User',
    'admin@example.com',
    '123-456-7890',
    '123 Admin St',
    '20240802-photo_2024-07-20_21-35-15.jpg'
  ),
  (
    2,
    '123123',
    'Default First Name',
    'Default Last Name',
    'staff@example.com',
    '123-456-7890',
    '123 Default St, City',
    'default_profile.jpg'
  );

--
-- Indexes for dumped tables
--
--
-- Indexes for table `about_us`
--
ALTER TABLE `about_us` ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ads`
--
ALTER TABLE `ads` ADD PRIMARY KEY (`id`);

--
-- Indexes for table `discounts`
--
ALTER TABLE `discounts` ADD PRIMARY KEY (`id`);

--
-- Indexes for table `guests`
--
ALTER TABLE `guests` ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations` ADD PRIMARY KEY (`id`),
ADD KEY `room_id` (`room_id`),
ADD KEY `guest_id` (`guest_id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms` ADD PRIMARY KEY (`id`),
ADD KEY `room_type_id` (`room_type_id`),
ADD KEY `status_code_id` (`status_code_id`);

--
-- Indexes for table `room_types`
--
ALTER TABLE `room_types` ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `services`
--
ALTER TABLE `services` ADD PRIMARY KEY (`id`),
ADD KEY `stay_record_id` (`stay_record_id`),
ADD KEY `service_list_id` (`service_list_id`);

--
-- Indexes for table `service_list`
--
ALTER TABLE `service_list` ADD PRIMARY KEY (`id`);

--
-- Indexes for table `status_codes`
--
ALTER TABLE `status_codes` ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `stay_records`
--
ALTER TABLE `stay_records` ADD PRIMARY KEY (`id`),
ADD KEY `room_id` (`room_id`),
ADD KEY `guest_id` (`guest_id`),
ADD KEY `discount_id` (`discount_id`);

--
-- Indexes for table `stay_records_history`
--
ALTER TABLE `stay_records_history` ADD PRIMARY KEY (`id`),
ADD KEY `room_id` (`room_id`),
ADD KEY `guest_id` (`guest_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users` ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `userId` (`userId`),
ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `user_log`
--
ALTER TABLE `user_log` ADD PRIMARY KEY (`log_id`),
ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_profile`
--
ALTER TABLE `user_profile` ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `email` (`email`),
ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--
--
-- AUTO_INCREMENT for table `about_us`
--
ALTER TABLE `about_us` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 2;

--
-- AUTO_INCREMENT for table `ads`
--
ALTER TABLE `ads` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 5;

--
-- AUTO_INCREMENT for table `discounts`
--
ALTER TABLE `discounts` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 3;

--
-- AUTO_INCREMENT for table `guests`
--
ALTER TABLE `guests` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 16;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 21;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 5;

--
-- AUTO_INCREMENT for table `room_types`
--
ALTER TABLE `room_types` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 5;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 34;

--
-- AUTO_INCREMENT for table `service_list`
--
ALTER TABLE `service_list` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 8;

--
-- AUTO_INCREMENT for table `status_codes`
--
ALTER TABLE `status_codes` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 25;

--
-- AUTO_INCREMENT for table `stay_records`
--
ALTER TABLE `stay_records` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 39;

--
-- AUTO_INCREMENT for table `stay_records_history`
--
ALTER TABLE `stay_records_history` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 34;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 3;

--
-- AUTO_INCREMENT for table `user_log`
--
ALTER TABLE `user_log` MODIFY `log_id` int (11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 1233;

--
-- AUTO_INCREMENT for table `user_profile`
--
ALTER TABLE `user_profile` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 3;

--
-- Constraints for dumped tables
--
--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`guest_id`) REFERENCES `guests` (`id`);

--
-- Constraints for table `rooms`
--
ALTER TABLE `rooms` ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`room_type_id`) REFERENCES `room_types` (`id`),
ADD CONSTRAINT `rooms_ibfk_2` FOREIGN KEY (`status_code_id`) REFERENCES `status_codes` (`id`);

--
-- Constraints for table `services`
--
ALTER TABLE `services` ADD CONSTRAINT `services_ibfk_1` FOREIGN KEY (`stay_record_id`) REFERENCES `stay_records` (`id`),
ADD CONSTRAINT `services_ibfk_2` FOREIGN KEY (`service_list_id`) REFERENCES `service_list` (`id`);

--
-- Constraints for table `stay_records`
--
ALTER TABLE `stay_records` ADD CONSTRAINT `stay_records_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
ADD CONSTRAINT `stay_records_ibfk_2` FOREIGN KEY (`guest_id`) REFERENCES `guests` (`id`),
ADD CONSTRAINT `stay_records_ibfk_3` FOREIGN KEY (`discount_id`) REFERENCES `discounts` (`id`);

--
-- Constraints for table `stay_records_history`
--
ALTER TABLE `stay_records_history` ADD CONSTRAINT `stay_records_history_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
ADD CONSTRAINT `stay_records_history_ibfk_2` FOREIGN KEY (`guest_id`) REFERENCES `guests` (`id`);

--
-- Constraints for table `user_log`
--
ALTER TABLE `user_log` ADD CONSTRAINT `user_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userId`);

--
-- Constraints for table `user_profile`
--
ALTER TABLE `user_profile` ADD CONSTRAINT `user_profile_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userId`);

COMMIT;