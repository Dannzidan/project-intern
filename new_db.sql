-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 04, 2023 at 08:51 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `new_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `model`
--

CREATE TABLE `model` (
  `id` int(11) NOT NULL,
  `assigned_mod` varchar(255) NOT NULL,
  `assigned_sup` varchar(255) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `model_image` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `model`
--

INSERT INTO `model` (`id`, `assigned_mod`, `assigned_sup`, `uuid`, `name`, `userId`, `createdAt`, `updatedAt`, `model_image`) VALUES
(1, 'nabil', 'zidan', '4a0e8fcb-3b3e-4584-b982-fec6ee7d6198', 'Coba-coba', 4, '2023-12-04 00:28:03', '2023-12-04 00:28:03', NULL),
(2, 'risma', 'zidan', 'b0364074-df26-4773-8c19-1dd29a755bc3', 'TEST', 4, '2023-12-04 00:29:53', '2023-12-04 00:29:53', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `sid` varchar(36) NOT NULL,
  `expires` datetime DEFAULT NULL,
  `data` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subtask`
--

CREATE TABLE `subtask` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `taskId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `assembly_approval` varchar(255) DEFAULT NULL,
  `assembly_progress` int(11) DEFAULT NULL,
  `assembly_image` text DEFAULT NULL,
  `machining_approval` varchar(255) DEFAULT NULL,
  `machining_progress` int(11) DEFAULT NULL,
  `machining_image` text DEFAULT NULL,
  `std_part_approval` varchar(255) DEFAULT NULL,
  `std_part_progress` int(11) DEFAULT NULL,
  `std_part_image` text DEFAULT NULL,
  `material_approval` varchar(255) DEFAULT NULL,
  `material_progress` int(11) DEFAULT NULL,
  `material_image` text DEFAULT NULL,
  `design_approval` varchar(255) DEFAULT NULL,
  `design_progress` int(11) DEFAULT NULL,
  `design_image` text DEFAULT NULL,
  `trial_approval` varchar(255) DEFAULT NULL,
  `trial_progress` int(11) DEFAULT NULL,
  `trial_image` text DEFAULT NULL,
  `harden_coating_approval` varchar(255) DEFAULT NULL,
  `harden_coating_progress` int(11) DEFAULT NULL,
  `harden_coating_image` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `id` int(11) NOT NULL,
  `assigned_mod` varchar(255) NOT NULL,
  `assigned_sup` varchar(255) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `task_progress` int(11) DEFAULT NULL,
  `task_image` text DEFAULT NULL,
  `modelId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trialtask`
--

CREATE TABLE `trialtask` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `part_name` varchar(255) NOT NULL,
  `visual_image` text DEFAULT NULL,
  `tanggalIn` datetime DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `tanggalCek` datetime DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `remark_image` text DEFAULT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `note` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trialtask`
--

INSERT INTO `trialtask` (`id`, `uuid`, `name`, `part_name`, `visual_image`, `tanggalIn`, `quantity`, `tanggalCek`, `status`, `remark_image`, `userId`, `createdAt`, `updatedAt`, `note`) VALUES
(12, '5072c46a-2bd8-47c0-9d35-94574c4c408d', 'kkk', 'okkk', 'data:image/jpeg;base64,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aHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8nPgogIDxleGlmOlBpeGVsWERpbWVuc2lvbj4zNDQ8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogIDxleGlmOlBpeGVsWURpbWVuc2lvbj4yODg8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogIDxleGlmOlVzZXJDb21tZW50PgogICA8cmRmOkFsdD4KICAgIDxyZGY6bGkgeG1sOmxhbmc9J3gtZGVmYXVsdCc+U2NyZWVuc2hvdDwvcmRmOmxpPgogICA8L3JkZjpBbHQ+CiAgPC9leGlmOlVzZXJDb21tZW50PgogPC9yZGY6RGVzY3JpcHRpb24+CjwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cv/bAEMAAwICAgICAwICAgMDAwMEBgQEBAQECAYGBQYJCAoKCQgJCQoMDwwKCw4LCQkNEQ0ODxAQERAKDBITEhATDxAQEP/bAEMBAwMDBAMECAQECBALCQsQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEP/AABEIASABWAMBEQACEQEDEQH/xAAdAAEAAAcBAQAAAAAAAAAAAAAAAQIEBQYHCAMJ/8QAURAAAQMDAgQEAwQDCQwJBQAAAQACAwQFEQYSByExQQgTUWEUInEVMoGxCSORFiRSVGKhwdHSFxg0QkNjcoOSk7LwJSYzU3OCoqPhN1V1lfH/xAAZAQEBAQEBAQAAAAAAAAAAAAAAAQIDBAX/xAAoEQEBAAICAgIBBAMBAQEAAAAAAQIRAyESMUFREwQiMmEzcYFCI2L/2gAMAwEAAhEDEQA/APqmgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICCUyRg4L2g/VBTVlzo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', NULL, NULL, NULL, NULL, NULL, 4, '2023-11-28 04:48:24', '2023-11-28 08:57:09', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `refresh_token` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `uuid`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`, `refresh_token`) VALUES
(4, '3ec9aa0d-a8e6-40d9-a265-d4ec1cac99ff', 'Admin', 'admin@email.com', '$argon2id$v=19$m=65536,t=3,p=4$FP67zfOfKcbESVGR6Lo9ZQ$g/UJI6IS8W4ZhGW3QAQym8Ar9RfraRm2j0dmt6tOTj4', 'admin', '2023-09-25 05:20:14', '2023-11-01 00:56:23', ''),
(15, 'a2514833-ddaf-499b-b158-499d5c7611a3', 'risma', 'risma@email.com', '$argon2id$v=19$m=65536,t=3,p=4$Tr30kRyIjFZazTGNaTHaxg$ldkWPl1fcPXZVM8WHq7OvFYzehdyclp2y8UrXUqKZJU', 'moderator', '2023-11-28 04:16:45', '2023-11-28 04:17:55', '-'),
(16, 'ec0b563e-d976-4a1f-a963-ba84100376cb', 'zidan', 'zidan@email.com', '$argon2id$v=19$m=65536,t=3,p=4$DzuKK+RTkNmQzEmyNZgq+w$73FRNaMMX9FL4FbuB5CB0EzdzFwp4DO4Y/tNG9ckgRw', 'supplier', '2023-11-28 04:17:08', '2023-11-28 04:17:08', '-'),
(17, '6f13c998-28fe-44a8-a891-cf5d523ec3e3', 'nabil', 'nabil@email.com', '$argon2id$v=19$m=65536,t=3,p=4$fG4vZQSO5tQvFen7p0t+nQ$jwIdB4fbQFrrrMXE3k0KoVD/tUwxeSmK7nnIjbLvYrk', 'moderator', '2023-11-28 07:00:34', '2023-11-28 07:00:34', '-');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `model`
--
ALTER TABLE `model`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`sid`);

--
-- Indexes for table `subtask`
--
ALTER TABLE `subtask`
  ADD PRIMARY KEY (`id`),
  ADD KEY `taskId` (`taskId`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`),
  ADD KEY `modelId` (`modelId`);

--
-- Indexes for table `trialtask`
--
ALTER TABLE `trialtask`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `model`
--
ALTER TABLE `model`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `subtask`
--
ALTER TABLE `subtask`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trialtask`
--
ALTER TABLE `trialtask`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `model`
--
ALTER TABLE `model`
  ADD CONSTRAINT `model_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `subtask`
--
ALTER TABLE `subtask`
  ADD CONSTRAINT `subtask_ibfk_1` FOREIGN KEY (`taskId`) REFERENCES `task` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `task_ibfk_1` FOREIGN KEY (`modelId`) REFERENCES `model` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `trialtask`
--
ALTER TABLE `trialtask`
  ADD CONSTRAINT `trialtask_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
