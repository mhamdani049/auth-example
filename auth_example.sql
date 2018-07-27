-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 27 Jul 2018 pada 04.03
-- Versi Server: 10.1.28-MariaDB
-- PHP Version: 7.1.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `auth_example`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `driver`
--

CREATE TABLE `driver` (
  `id` int(15) NOT NULL,
  `employee` varchar(255) NOT NULL,
  `nopol` varchar(9) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `driver`
--

INSERT INTO `driver` (`id`, `employee`, `nopol`, `createdAt`, `updatedAt`) VALUES
(10, '72ac31ed-fc62-4339-8b1d-0eda2a210b6b', 'F-2755-CY', '2018-07-27 07:35:57', '2018-07-27 07:39:06');

-- --------------------------------------------------------

--
-- Struktur dari tabel `mod_orderitemstatuschangelog`
--

CREATE TABLE `mod_orderitemstatuschangelog` (
  `id` varchar(255) NOT NULL,
  `orderItem` int(15) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `createdBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktur dari tabel `mod_ordertransport`
--

CREATE TABLE `mod_ordertransport` (
  `id` varchar(255) NOT NULL,
  `service` int(15) DEFAULT NULL,
  `fromLocationLng` varchar(45) DEFAULT NULL,
  `fromLocationLat` varchar(45) DEFAULT NULL,
  `fromPlaceName` varchar(255) DEFAULT NULL,
  `fromStreetAddress` tinytext,
  `fromPersonName` varchar(45) DEFAULT NULL,
  `fromPersonContact` varchar(45) DEFAULT NULL,
  `fromPersonType` varchar(50) DEFAULT NULL,
  `fromSignature` varchar(255) DEFAULT NULL,
  `fromArrivalTimeBusiness` time DEFAULT NULL,
  `fromArrivalTimePKS` time DEFAULT NULL,
  `fromPhoto` text,
  `fromLateReason` text,
  `totalItem` int(15) DEFAULT '0',
  `documentType` enum('Plastik','Dus') DEFAULT NULL,
  `toLocationLng` varchar(45) DEFAULT NULL,
  `toLocationLat` varchar(45) DEFAULT NULL,
  `toPlaceName` varchar(255) DEFAULT NULL,
  `toStreetAddress` tinytext,
  `toPersonName` varchar(45) DEFAULT NULL,
  `toPersonContact` varchar(45) DEFAULT NULL,
  `toPersonType` varchar(50) DEFAULT NULL,
  `toSignature` varchar(255) DEFAULT NULL,
  `toArrivalTimeBusiness` time DEFAULT NULL,
  `toArrivalTimePKS` time DEFAULT NULL,
  `toPhoto` text,
  `toLateReason` text,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktur dari tabel `permissions`
--

CREATE TABLE `permissions` (
  `perm_id` int(11) NOT NULL,
  `perm_desc` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `permissions`
--

INSERT INTO `permissions` (`perm_id`, `perm_desc`) VALUES
(1, 'userAdd'),
(2, 'userEdit'),
(3, 'userDelete'),
(4, 'rolesEdit');

-- --------------------------------------------------------

--
-- Struktur dari tabel `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(1, 'User');

-- --------------------------------------------------------

--
-- Struktur dari tabel `role_perm`
--

CREATE TABLE `role_perm` (
  `role_id` int(11) DEFAULT NULL,
  `perm_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `role_perm`
--

INSERT INTO `role_perm` (`role_id`, `perm_id`) VALUES
(1, 1),
(1, 2);

-- --------------------------------------------------------

--
-- Struktur dari tabel `tblhosting`
--

CREATE TABLE `tblhosting` (
  `id` int(11) NOT NULL,
  `driver` varchar(255) DEFAULT NULL,
  `userId` int(10) DEFAULT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  `packageId` int(10) DEFAULT NULL,
  `paymenMethod` text,
  `amount` decimal(10,2) DEFAULT NULL,
  `domainStatus` enum('Pending','Started','Active','Terminate','Cancelled','Finish','Return','On Hold') DEFAULT NULL,
  `returnReason` varchar(255) DEFAULT NULL,
  `onHoldReason` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tblproducts`
--

CREATE TABLE `tblproducts` (
  `id` int(15) NOT NULL,
  `type` varchar(45) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `category` int(15) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `tblproducts`
--

INSERT INTO `tblproducts` (`id`, `type`, `name`, `description`, `category`, `amount`, `createdAt`, `updatedAt`) VALUES
(1, 'other', 'Dedicated Courier', NULL, 252, '15000.00', '2018-07-17 22:06:38', '2018-07-17 22:06:44'),
(2, 'other', 'Top Urgent', NULL, 252, '25000.00', '2018-07-17 22:06:38', '2018-07-17 22:06:44');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `id` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `avatarUrl` varchar(255) DEFAULT NULL,
  `avatarFd` varchar(255) DEFAULT NULL,
  `encryptedPassword` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id`, `email`, `firstName`, `lastName`, `avatarUrl`, `avatarFd`, `encryptedPassword`, `createdAt`, `updatedAt`) VALUES
('630d2e5e-0576-40c6-9bd7-0339ca99acb3', 'admin@gmail.com', 'Muhamad Yusup', 'Hamdani', NULL, NULL, '$2a$10$1N9CkN.yvzt5jUdFa7vMAO.THHPykgo6nCt7qFxXhrQyFoMizbjRG', '2018-05-14 20:30:15', '2018-07-22 07:35:52'),
('72ac31ed-fc62-4339-8b1d-0eda2a210b6b', 'rahmayanti144@gmail.com', 'Rahma', 'Yanti', NULL, NULL, '$2a$10$.nTmDZ4LdB0HdyHHZ/SZdOfmyvDjs14AvaeHFTGwedj2/pxnWA7K.', '2018-07-27 07:30:34', '2018-07-27 07:30:34');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_role`
--

CREATE TABLE `user_role` (
  `user_id` varchar(255) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `user_role`
--

INSERT INTO `user_role` (`user_id`, `role_id`) VALUES
('630d2e5e-0576-40c6-9bd7-0339ca99acb3', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `driver`
--
ALTER TABLE `driver`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_UNIQUE` (`employee`),
  ADD UNIQUE KEY `nopol_UNIQUE` (`nopol`);

--
-- Indexes for table `mod_orderitemstatuschangelog`
--
ALTER TABLE `mod_orderitemstatuschangelog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orderItem` (`orderItem`);

--
-- Indexes for table `mod_ordertransport`
--
ALTER TABLE `mod_ordertransport`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service` (`service`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`perm_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `role_perm`
--
ALTER TABLE `role_perm`
  ADD KEY `role_id` (`role_id`),
  ADD KEY `perm_id` (`perm_id`);

--
-- Indexes for table `tblhosting`
--
ALTER TABLE `tblhosting`
  ADD PRIMARY KEY (`id`),
  ADD KEY `driver` (`driver`),
  ADD KEY `packageId` (`packageId`);

--
-- Indexes for table `tblproducts`
--
ALTER TABLE `tblproducts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_role`
--
ALTER TABLE `user_role`
  ADD KEY `user_id` (`user_id`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `driver`
--
ALTER TABLE `driver`
  MODIFY `id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `perm_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tblhosting`
--
ALTER TABLE `tblhosting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tblproducts`
--
ALTER TABLE `tblproducts`
  MODIFY `id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `driver`
--
ALTER TABLE `driver`
  ADD CONSTRAINT `driver_ibfk_1` FOREIGN KEY (`employee`) REFERENCES `user` (`id`);

--
-- Ketidakleluasaan untuk tabel `mod_orderitemstatuschangelog`
--
ALTER TABLE `mod_orderitemstatuschangelog`
  ADD CONSTRAINT `mod_orderitemstatuschangelog_ibfk_1` FOREIGN KEY (`orderItem`) REFERENCES `tblhosting` (`id`);

--
-- Ketidakleluasaan untuk tabel `mod_ordertransport`
--
ALTER TABLE `mod_ordertransport`
  ADD CONSTRAINT `mod_ordertransport_ibfk_1` FOREIGN KEY (`service`) REFERENCES `tblhosting` (`id`);

--
-- Ketidakleluasaan untuk tabel `role_perm`
--
ALTER TABLE `role_perm`
  ADD CONSTRAINT `role_perm_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`),
  ADD CONSTRAINT `role_perm_ibfk_2` FOREIGN KEY (`perm_id`) REFERENCES `permissions` (`perm_id`);

--
-- Ketidakleluasaan untuk tabel `tblhosting`
--
ALTER TABLE `tblhosting`
  ADD CONSTRAINT `tblhosting_ibfk_1` FOREIGN KEY (`driver`) REFERENCES `driver` (`employee`),
  ADD CONSTRAINT `tblhosting_ibfk_2` FOREIGN KEY (`packageId`) REFERENCES `tblproducts` (`id`);

--
-- Ketidakleluasaan untuk tabel `user_role`
--
ALTER TABLE `user_role`
  ADD CONSTRAINT `user_role_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `user_role_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
