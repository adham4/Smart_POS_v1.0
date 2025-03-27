CREATE DATABASE  IF NOT EXISTS `pos_system` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pos_system`;
-- MySQL dump 10.13  Distrib 8.0.41, for macos15 (arm64)
--
-- Host: 127.0.0.1    Database: pos_system
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Comments`
--

DROP TABLE IF EXISTS `Comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `commentText` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `color` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comments`
--

LOCK TABLES `Comments` WRITE;
/*!40000 ALTER TABLE `Comments` DISABLE KEYS */;
INSERT INTO `Comments` VALUES (1,'بدون بصل','2025-03-15 21:58:09','#2d2d2d',0.00),(2,'حار','2025-03-15 21:58:09','#9a031e',0.00),(3,'بدون كاتشب','2025-03-15 21:58:09','#2d2d2d',0.00),(4,'زيادة كاتشب','2025-03-15 21:58:09','\n#e5042d',0.00),(5,'بدون مايو','2025-03-15 21:58:09','#2d2d2d',0.00),(6,'زيادة مايو','2025-03-15 21:58:09','\n#e5042d',0.00),(7,'زياده صوص','2025-03-15 21:58:09','#ff4500',5.00),(8,'اضافه جبنه ','2025-03-15 21:58:09','#f97300',5.00),(9,'شي','2025-03-20 22:46:07','#cccccc',5.00),(10,'ad','2025-03-20 23:00:05','#cccccc',10.00),(11,'aash','2025-03-20 23:25:53','#cccccc',10.00);
/*!40000 ALTER TABLE `Comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `totalSpent` decimal(10,2) DEFAULT '0.00',
  `totalOrders` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'ادهم نمر','المتوكل مع سعيد','01005078132',235.00,3),(2,'حسن الصولي','كليه تجاره مع سعيد','01211228565',150.00,2),(3,'ابراهيم حريز','اول ط شوبر','01026218541',85.00,1),(4,'مصطفي الشلق','عمر عبد العزيز','01093438052',95.00,1),(5,'عبدو هشام','قحافه','01021267065',5.00,1),(6,'علي','كليه تجاره من سعيد','01062882739',75.00,1),(7,'احمد نمر','المتوكل مع سعيد','01025572081',75.00,1),(9,'محمود ختعم','قحافه','01210695643',265.00,1),(10,'حازم الذهبي','ش سعيد','01096344203',100.00,1),(11,'كرم','كوبري فاروق','01112658012',350.00,1),(12,'مختار بيه','بسيون','01009870695',95.00,1);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `daily_closing`
--

DROP TABLE IF EXISTS `daily_closing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `daily_closing` (
  `id` int NOT NULL AUTO_INCREMENT,
  `closingDate` date NOT NULL,
  `totalOrders` int DEFAULT '0',
  `totalSandwiches` int DEFAULT '0',
  `totalRevenue` decimal(10,2) DEFAULT '0.00',
  `totalCost` decimal(10,2) DEFAULT '0.00',
  `totalEarnings` decimal(10,2) DEFAULT '0.00',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `totalDiscount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `onlinePaymentsTotal` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daily_closing`
--

LOCK TABLES `daily_closing` WRITE;
/*!40000 ALTER TABLE `daily_closing` DISABLE KEYS */;
/*!40000 ALTER TABLE `daily_closing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DailyClosings`
--

DROP TABLE IF EXISTS `DailyClosings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DailyClosings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `totalOrders` int NOT NULL DEFAULT '0',
  `totalRevenue` float NOT NULL DEFAULT '0',
  `totalCost` float NOT NULL DEFAULT '0',
  `totalEarnings` float NOT NULL DEFAULT '0',
  `closingDate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DailyClosings`
--

LOCK TABLES `DailyClosings` WRITE;
/*!40000 ALTER TABLE `DailyClosings` DISABLE KEYS */;
/*!40000 ALTER TABLE `DailyClosings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discount_codes`
--

DROP TABLE IF EXISTS `discount_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount_codes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_type` enum('percentage','fixed') COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `applicable_products` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount_codes`
--

LOCK TABLES `discount_codes` WRITE;
/*!40000 ALTER TABLE `discount_codes` DISABLE KEYS */;
INSERT INTO `discount_codes` VALUES (4,'zy','fixed',5.00,'2025-03-03','2025-04-06','[\"Cheese Beef\", \"Classic Chicken\"]',1);
/*!40000 ALTER TABLE `discount_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `min` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `cost` decimal(10,2) NOT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `dateAdded` datetime DEFAULT CURRENT_TIMESTAMP,
  `expiryDate` datetime DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,'Beef',95.05,4.00,35000.00,350.00,'kg','2025-02-04 23:08:40','2025-04-11 00:00:00','2025-02-04 23:08:40','2025-03-27 18:59:03'),(3,'Bread',114.00,15.00,1200.00,8.00,'piece','2025-02-05 02:41:09','2025-04-09 00:00:00','2025-02-05 02:41:09','2025-03-27 18:59:03'),(4,'Sauce',7.25,1.00,1000.00,100.00,'kg','2025-02-05 02:41:40','2025-04-11 00:00:00','2025-02-05 02:41:40','2025-03-27 18:59:03'),(5,'Veggies',10.00,2.00,1000.00,100.00,'kg','2025-02-05 02:41:56','2025-04-03 00:00:00','2025-02-05 02:41:56','2025-03-13 22:36:34');
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monthly_closing`
--

DROP TABLE IF EXISTS `monthly_closing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monthly_closing` (
  `id` int NOT NULL AUTO_INCREMENT,
  `month_year` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_orders` int NOT NULL DEFAULT '0',
  `total_sandwiches` int NOT NULL DEFAULT '0',
  `total_revenue` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_cost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_earnings` decimal(10,2) NOT NULL DEFAULT '0.00',
  `totalDiscount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `onlinePaymentsTotal` decimal(10,2) DEFAULT '0.00',
  `closing_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monthly_closing`
--

LOCK TABLES `monthly_closing` WRITE;
/*!40000 ALTER TABLE `monthly_closing` DISABLE KEYS */;
INSERT INTO `monthly_closing` VALUES (1,'2025-03',13,19,1785.00,393.00,1352.00,40.00,0.00,'2025-03-22 21:22:40');
/*!40000 ALTER TABLE `monthly_closing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MonthlyClosings`
--

DROP TABLE IF EXISTS `MonthlyClosings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MonthlyClosings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `totalOrders` int NOT NULL DEFAULT '0',
  `totalRevenue` float NOT NULL DEFAULT '0',
  `totalCost` float NOT NULL DEFAULT '0',
  `totalEarnings` float NOT NULL DEFAULT '0',
  `closingMonth` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MonthlyClosings`
--

LOCK TABLES `MonthlyClosings` WRITE;
/*!40000 ALTER TABLE `MonthlyClosings` DISABLE KEYS */;
/*!40000 ALTER TABLE `MonthlyClosings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OrderDetails`
--

DROP TABLE IF EXISTS `OrderDetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OrderDetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int DEFAULT NULL,
  `productId` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  CONSTRAINT `orderdetails_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `Orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OrderDetails`
--

LOCK TABLES `OrderDetails` WRITE;
/*!40000 ALTER TABLE `OrderDetails` DISABLE KEYS */;
/*!40000 ALTER TABLE `OrderDetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customerId` int NOT NULL,
  `deliveryPrice` decimal(10,2) DEFAULT NULL,
  `customerName` varchar(255) DEFAULT NULL,
  `customerAddress` varchar(255) DEFAULT NULL,
  `customerPhone` varchar(20) DEFAULT NULL,
  `orderDetails` text,
  `orderTotal` float DEFAULT NULL,
  `isCancelled` varchar(10) DEFAULT 'No',
  `archived` tinyint(1) DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `discountAmount` float DEFAULT '0',
  `payment_status` varchar(20) DEFAULT 'unpaid',
  `totalAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `customerId` (`customerId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,3,10.00,'ابراهيم حريز','اول ط شوبر','01026218541','[{\"name\":\"Classic Beef\",\"price\":\"75.00\",\"quantity\":1,\"comments\":[]}]',85,'No',0,'2025-03-24 19:04:27',0,'Paid',0.00),(2,2,0.00,'حسن الصولي','كليه تجاره مع سعيد','01211228565','[{\"name\":\"Classic Beef\",\"price\":\"75.00\",\"quantity\":1,\"comments\":[]}]',75,'No',0,'2025-03-24 19:04:56',0,'Pending',0.00),(3,1,0.00,'ادهم نمر','المتوكل مع سعيد','01005078132','[{\"name\":\"Classic Beef\",\"price\":\"75.00\",\"quantity\":1,\"comments\":[]}]',75,'No',0,'2025-03-24 19:05:52',0,'Pending',0.00),(4,1,0.00,'ادهم نمر','المتوكل مع سعيد','01005078132','[{\"name\":\"Classic Beef\",\"price\":\"75.00\",\"quantity\":1,\"comments\":[]}]',75,'No',0,'2025-03-24 19:06:39',0,'Pending',0.00),(5,1,10.00,'ادهم نمر','المتوكل مع سعيد','01005078132','[{\"name\":\"Classic Beef\",\"price\":\"75.00\",\"quantity\":1,\"comments\":[]}]',85,'No',0,'2025-03-24 19:07:04',0,'Pending',0.00),(6,2,0.00,'حسن الصولي','كليه تجاره مع سعيد','01211228565','[{\"name\":\"Classic Beef\",\"price\":\"75.00\",\"quantity\":1,\"comments\":[]}]',75,'No',0,'2025-03-27 18:59:03',0,'Pending',0.00);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `payment_method` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_amount` decimal(10,2) NOT NULL,
  `payment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `payments_ibfk_1` (`order_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,'electronic',85.00,'2025-03-24 19:04:27'),(2,2,'cash',75.00,'2025-03-24 19:04:56'),(3,3,'cash',75.00,'2025-03-24 19:05:52'),(4,4,'cash',75.00,'2025-03-24 19:06:39'),(5,5,'cash',85.00,'2025-03-24 19:07:04'),(6,6,'cash',75.00,'2025-03-27 18:59:03');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` enum('beef','chicken','french','combo','Add_ons') NOT NULL DEFAULT 'beef',
  `sold` int NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Classic Beef',75.00,'beef',10,'2025-01-25 23:26:49','2025-03-27 18:59:03'),(2,'Spicy Beef',95.00,'beef',0,'2025-01-25 23:26:49','2025-03-22 21:22:40'),(3,'Cheese Beef',100.00,'beef',3,'2025-01-25 23:26:49','2025-03-24 18:57:21'),(4,'Mushroom Beef',105.00,'beef',0,'2025-01-25 23:26:49','2025-03-22 21:22:40'),(5,'BBQ Beef',100.00,'beef',2,'2025-01-25 23:26:49','2025-03-24 18:33:39'),(6,'Double Beef',150.00,'beef',0,'2025-01-25 23:26:49','2025-03-22 21:22:40'),(7,'Classic Chicken',90.00,'chicken',0,'2025-01-25 23:26:49','2025-03-22 21:22:40'),(8,'Spicy Chicken',95.00,'chicken',0,'2025-01-25 23:26:49','2025-03-22 21:22:40'),(9,'Chicken Pastrami',100.00,'chicken',0,'2025-01-25 23:26:49','2025-03-22 21:22:40'),(10,'Psyco Chicken',105.00,'chicken',0,'2025-01-25 23:26:49','2025-03-22 21:22:40'),(11,'Crunchy Mozzarella',150.00,'chicken',0,'2025-01-25 23:26:49','2025-03-22 21:22:40'),(12,'Double Chicken',105.00,'chicken',0,'2025-01-25 23:26:49','2025-03-22 21:22:40'),(13,'Double Mix',105.00,'beef',0,'2025-01-25 23:26:49','2025-03-22 21:22:40'),(14,'Onion Rings',25.00,'Add_ons',0,'2025-01-25 23:26:49','2025-03-22 21:22:40'),(15,'Mozzarella Fries',25.00,'Add_ons',0,'2025-01-25 23:26:49','2025-03-22 21:22:40'),(16,'Chezzy Fries',30.00,'Add_ons',0,'2025-01-25 23:26:49','2025-03-22 21:22:40'),(17,'Smokey Fries',35.00,'Add_ons',0,'2025-01-25 23:26:49','2025-03-22 21:22:40'),(18,'Texas Fries',30.00,'Add_ons',0,'2025-01-25 23:26:49','2025-03-22 21:22:40'),(19,'Chicken Pizza ',70.00,'french',0,'2025-01-25 23:26:49','2025-03-22 21:22:40'),(22,'Smoked Savory',70.00,'french',0,'2025-03-01 19:20:47','2025-03-22 21:22:40');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipes`
--

DROP TABLE IF EXISTS `recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sandwich` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ingredient` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `recipes_ibfk_1` (`ingredient`),
  CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`ingredient`) REFERENCES `inventory` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipes`
--

LOCK TABLES `recipes` WRITE;
/*!40000 ALTER TABLE `recipes` DISABLE KEYS */;
INSERT INTO `recipes` VALUES (4,'Classic Beef','Beef',0.15),(5,'Classic Beef','Bread',1.00),(6,'Classic Beef','Sauce',0.05);
/*!40000 ALTER TABLE `recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SaleProducts`
--

DROP TABLE IF EXISTS `SaleProducts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SaleProducts` (
  `SaleId` int NOT NULL,
  `ProductId` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`SaleId`,`ProductId`),
  KEY `ProductId` (`ProductId`),
  CONSTRAINT `saleproducts_ibfk_1` FOREIGN KEY (`ProductId`) REFERENCES `Products` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SaleProducts`
--

LOCK TABLES `SaleProducts` WRITE;
/*!40000 ALTER TABLE `SaleProducts` DISABLE KEYS */;
/*!40000 ALTER TABLE `SaleProducts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sales`
--

DROP TABLE IF EXISTS `Sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Sales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `quantity_sold` int DEFAULT NULL,
  `sale_date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sales`
--

LOCK TABLES `Sales` WRITE;
/*!40000 ALTER TABLE `Sales` DISABLE KEYS */;
/*!40000 ALTER TABLE `Sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_products`
--

DROP TABLE IF EXISTS `sales_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `saleId` int NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `saleId` (`saleId`),
  KEY `productId` (`productId`),
  CONSTRAINT `sales_products_ibfk_1` FOREIGN KEY (`saleId`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sales_products_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_products`
--

LOCK TABLES `sales_products` WRITE;
/*!40000 ALTER TABLE `sales_products` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('cashier','manager') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'admin','$2b$10$eoLlKAbwgjiHs61CtzmBb.xgLwnIzwkFxfGYl39e1xKV/jp/Gj9RO','manager'),(2,'adham','$2b$10$ta9tR15Ai1jE1Mxd5pHJJuV63StZGCx34a5loy04Bdj4.P7Xkt.4S','cashier');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-27 21:23:10
