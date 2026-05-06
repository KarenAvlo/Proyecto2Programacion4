-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: bolsa_empleo
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `caracteristica`
--

DROP TABLE IF EXISTS `caracteristica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `caracteristica` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `id_padre` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbdrwmh3uny8wvw16s3hbfn77j` (`id_padre`),
  CONSTRAINT `FKbdrwmh3uny8wvw16s3hbfn77j` FOREIGN KEY (`id_padre`) REFERENCES `caracteristica` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `caracteristica`
--

LOCK TABLES `caracteristica` WRITE;
/*!40000 ALTER TABLE `caracteristica` DISABLE KEYS */;
INSERT INTO `caracteristica` VALUES (1,'Lenguajes de Programación',NULL),(3,'Java',1),(4,'C++',1),(5,'C#',1),(6,'Python',1),(7,'Tecnologías Web',NULL),(8,'HTML',7),(9,'CSS',7),(10,'JavaScript',7),(11,'PHP',1),(12,'TypeScript',7),(13,'Angular',7),(14,'React',7),(15,'Bases de Datos',NULL),(16,'SQL Server',15),(17,'PostgreSQl',15),(18,'MySQL',15),(19,'MongoDB',15),(20,'Oracle',15),(21,'Infraestructura y Cloud',NULL),(22,'AWS',21),(23,'Azure',21),(24,'Google Cloud',21),(25,'Docker',21),(26,'Kubernetes',21),(27,'Metodologías y Herramientas',NULL),(28,'Scrum',27),(29,'Git/GitHub',27),(30,'Jenkins( CI/CD )',27),(31,'Pruebas Unitarias( JUnit/Nunit )',27),(32,'Habilidades Blandas',NULL),(33,'Liderazgo',32),(34,'Comunicación Asertiva',32),(35,'Trabajo en Equipo',32),(36,'Resolución de Problemas',32),(37,'Idiomas',NULL),(38,'Inglés Técnico',37),(39,'Inglés Conversacional',37),(40,'Portugués',37);
/*!40000 ALTER TABLE `caracteristica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresa`
--

DROP TABLE IF EXISTS `empresa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresa` (
  `descripcion` tinytext,
  `localizacion` varchar(200) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`email`),
  CONSTRAINT `FK71acyfjo59o7kv40dhbgycek5` FOREIGN KEY (`email`) REFERENCES `usuario` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresa`
--

LOCK TABLES `empresa` WRITE;
/*!40000 ALTER TABLE `empresa` DISABLE KEYS */;
INSERT INTO `empresa` VALUES ('Desarrollo de software a medida y consultoría cloud.','Heredia, CR','InnovaTech Solutions','2222-1111','contacto@innovatech.com'),('Empresa líder en tecnología','San José, CR','Tech Solutions','7777-7777','empresa@bolsa.com'),('Somos una empresa dedicada a hacer Galletas','San José','Galleta Pozuelo','88888888','pozuelo@empresa.com'),('Institución bancaria líder en Centroamérica.','San José, CR','Banco Financiero Global','2555-0000','rrhh@bancofinanciero.com'),('Empresa argentina de software de ingeniería para la industria petrolera','San José','SoftLab','56894587','softlab@empresa.com'),('Brindamos servicios en: Diseño Web, Diseño Gráfico','Heredia','Web Soft','78549632','websoftcr@empresa.com');
/*!40000 ALTER TABLE `empresa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oferente`
--

DROP TABLE IF EXISTS `oferente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oferente` (
  `apellido` varchar(50) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `curriculo_path` varchar(255) DEFAULT NULL,
  `nacionalidad` varchar(50) DEFAULT NULL,
  `nombre` varchar(50) NOT NULL,
  `residencia` varchar(200) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`email`),
  CONSTRAINT `FKt10ux63r3upqr00a0erdjy2n1` FOREIGN KEY (`email`) REFERENCES `usuario` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oferente`
--

LOCK TABLES `oferente` WRITE;
/*!40000 ALTER TABLE `oferente` DISABLE KEYS */;
INSERT INTO `oferente` VALUES ('Sanchez','108790654','carlos.sanchez@email.com_cv.pdf','Panameña','Carlos ','San José','87776655','carlos.sanchez@email.com'),('Gutiérrez','800900587',NULL,'Nicaragüense','Darling','Alajuela','62435548','darling@oferente.com'),('Avilés','208160954',NULL,'Costarricense','Karen','Heredia','50176719','karen@oferente.com'),('Montero','504320165','luis.montero@email.com_cv.pdf','Costarricense','Luis','Guanacaste','54897684','luis.montero@email.com'),('Rodríguez','102340567',NULL,'Costarricense','María','Alajuela','65559877','maria.rodriguez@email.com'),('Pérez','1-1111-1111','oferente@bolsa.com_cv.pdf','Costarricense','Juan','SanJosé','8888-8888','oferente@bolsa.com');
/*!40000 ALTER TABLE `oferente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oferente_caracteristica`
--

DROP TABLE IF EXISTS `oferente_caracteristica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oferente_caracteristica` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nivel` int DEFAULT NULL,
  `cedula_oferente` varchar(100) DEFAULT NULL,
  `id_caracteristica` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3f3ptp7vf9bmc2rcvapxikddg` (`cedula_oferente`),
  KEY `FKt3gyf7wxawxwwmgncaecvtbq1` (`id_caracteristica`),
  CONSTRAINT `FK3f3ptp7vf9bmc2rcvapxikddg` FOREIGN KEY (`cedula_oferente`) REFERENCES `oferente` (`email`),
  CONSTRAINT `FKt3gyf7wxawxwwmgncaecvtbq1` FOREIGN KEY (`id_caracteristica`) REFERENCES `caracteristica` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oferente_caracteristica`
--

LOCK TABLES `oferente_caracteristica` WRITE;
/*!40000 ALTER TABLE `oferente_caracteristica` DISABLE KEYS */;
INSERT INTO `oferente_caracteristica` VALUES (2,5,'oferente@bolsa.com',1),(3,4,'oferente@bolsa.com',38),(13,4,'luis.montero@email.com',3),(14,3,'luis.montero@email.com',16),(15,2,'luis.montero@email.com',26),(16,5,'luis.montero@email.com',34),(17,5,'luis.montero@email.com',40),(18,5,'carlos.sanchez@email.com',36),(19,2,'carlos.sanchez@email.com',13),(20,5,'carlos.sanchez@email.com',10),(21,3,'carlos.sanchez@email.com',19),(22,4,'carlos.sanchez@email.com',29),(23,4,'maria.rodriguez@email.com',17),(24,5,'maria.rodriguez@email.com',22),(25,3,'maria.rodriguez@email.com',31),(26,3,'maria.rodriguez@email.com',6),(27,5,'maria.rodriguez@email.com',11);
/*!40000 ALTER TABLE `oferente_caracteristica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puesto`
--

DROP TABLE IF EXISTS `puesto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `puesto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `activo` bit(1) DEFAULT b'1',
  `descripcion` tinytext NOT NULL,
  `fecha_publicacion` datetime(6) DEFAULT NULL,
  `salario_ofrecido` decimal(10,2) DEFAULT NULL,
  `moneda` varchar(3) DEFAULT 'CRC',
  `tipo_publicacion` varchar(10) DEFAULT NULL,
  `email_empresa` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8gc6101u3st65blyth8n6divq` (`email_empresa`),
  CONSTRAINT `FK8gc6101u3st65blyth8n6divq` FOREIGN KEY (`email_empresa`) REFERENCES `empresa` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puesto`
--

LOCK TABLES `puesto` WRITE;
/*!40000 ALTER TABLE `puesto` DISABLE KEYS */;
INSERT INTO `puesto` VALUES (1,_binary '\0','Full Stack Developer','2026-03-21 17:28:34.449888',1200000.00,'CRC','PUBLICA','empresa@bolsa.com'),(2,_binary '','Desarrollador Backend','2026-03-21 20:17:21.342050',1500000.00,'CRC','PUBLICA','empresa@bolsa.com'),(3,_binary '','Software Developer','2026-03-21 21:17:35.955538',500.00,'CRC','PUBLICA','empresa@bolsa.com'),(4,_binary '','Unity game developer','2026-03-25 05:46:08.999585',650.00,'USD','PRIVADA','empresa@bolsa.com'),(5,_binary '','Analista de Datos Python','2026-03-25 10:00:00.000000',1800000.00,'CRC','PUBLICA','contacto@innovatech.com'),(6,_binary '','Especialista en Seguridad Cloud','2026-03-25 11:30:00.000000',3500.00,'USD','PUBLICA','contacto@innovatech.com'),(7,_binary '','Desarrollador Java Senior','2026-03-25 09:15:00.000000',2200000.00,'CRC','PRIVADA','rrhh@bancofinanciero.com'),(8,_binary '','Embeded software developer','2026-03-27 05:27:59.533201',2400.00,'USD','PRIVADA','softlab@empresa.com'),(9,_binary '','Frontend Developer','2026-03-27 05:29:44.880467',1500000.00,'CRC','PUBLICA','softlab@empresa.com');
/*!40000 ALTER TABLE `puesto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puesto_caracteristica`
--

DROP TABLE IF EXISTS `puesto_caracteristica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `puesto_caracteristica` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nivel_deseado` int DEFAULT NULL,
  `id_caracteristica` int DEFAULT NULL,
  `id_puesto` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK2b8nqkwlt4pxsn5ywhkivbnru` (`id_caracteristica`),
  KEY `FKmk53vgh9vgoeynckqkmygup7b` (`id_puesto`),
  CONSTRAINT `FK2b8nqkwlt4pxsn5ywhkivbnru` FOREIGN KEY (`id_caracteristica`) REFERENCES `caracteristica` (`id`),
  CONSTRAINT `FKmk53vgh9vgoeynckqkmygup7b` FOREIGN KEY (`id_puesto`) REFERENCES `puesto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puesto_caracteristica`
--

LOCK TABLES `puesto_caracteristica` WRITE;
/*!40000 ALTER TABLE `puesto_caracteristica` DISABLE KEYS */;
INSERT INTO `puesto_caracteristica` VALUES (1,3,3,1),(2,3,1,2),(3,3,3,3),(4,3,4,3),(5,2,9,4),(6,1,15,4),(7,4,6,5),(8,3,16,5),(9,4,22,6),(10,4,39,6),(11,5,3,7),(12,3,28,7),(13,3,11,8),(14,4,28,8),(15,3,17,8),(16,4,13,9),(17,4,30,9),(18,4,32,9),(19,2,40,9);
/*!40000 ALTER TABLE `puesto_caracteristica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `requisito`
--

DROP TABLE IF EXISTS `requisito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `requisito` (
  `id` int NOT NULL AUTO_INCREMENT,
  `puesto_id` int NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `nivel` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_puesto_requisito` (`puesto_id`),
  CONSTRAINT `fk_puesto_requisito` FOREIGN KEY (`puesto_id`) REFERENCES `puesto` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requisito`
--

LOCK TABLES `requisito` WRITE;
/*!40000 ALTER TABLE `requisito` DISABLE KEYS */;
/*!40000 ALTER TABLE `requisito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `email` varchar(100) NOT NULL,
  `clave` varchar(100) NOT NULL,
  `estado` bit(1) DEFAULT b'0',
  `tipo` varchar(20) NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES ('admin@bolsa.com','$2a$10$8mOF5zF/a0pNeB41XEz01uQeFKieLwiz0gRGlFZgznXj7eJEONT5W',_binary '','ADMIN'),('carlos.sanchez@email.com','$2a$10$kXq0JqawRYpcHbZAMtQPmeSrJjRuR2mS4aWDJzUm6kMU1LqKnbkKG',_binary '','OFERENTE'),('contacto@innovatech.com','$2a$10$8mOF5zF/a0pNeB41XEz01uQeFKieLwiz0gRGlFZgznXj7eJEONT5W',_binary '','EMPRESA'),('darling@oferente.com','$2a$10$YHV59Lrn9EyZ8aZ4GlE3Uumb/KKDEn4qUJod71GzQoFMD/RgjpiDm',_binary '\0','OFERENTE'),('empresa@bolsa.com','$2a$10$lV7kdGP82fmCsvS05ziJpOXP8PbsADPYIyUVo3Zoajs2Lig8KQWaK',_binary '','EMPRESA'),('karen@oferente.com','$2a$10$7a0R3HPnjUqxoPoD6M6yA./rG3QQdjk4/9h1PP88sPppxWck1SI3C',_binary '\0','OFERENTE'),('luis.montero@email.com','$2a$10$qS6f5Ele3H9Cz/ak7q1JsOTR8Y3hWjfzy1wFyMQilc9PeC./ZhooS',_binary '','OFERENTE'),('maria.rodriguez@email.com','$2a$10$vIgPM586eCarsZh1VpbHe.n1GC7djeIBfJgc1uPFwPNwkl35e.vPe',_binary '','OFERENTE'),('oferente@bolsa.com','$2a$10$3MhBW/X3wyBoL3zhHsNCa.ADyYpT/1AeC2PnvUh6h2pq6X/TL3Ll.',_binary '','OFERENTE'),('pozuelo@empresa.com','$2a$10$4H7HFMmC6F7C8dtDAIXMBeAJqlv/PilVksdWEeKDzmM/hAlZuNqQm',_binary '\0','EMPRESA'),('rrhh@bancofinanciero.com','$2a$10$8mOF5zF/a0pNeB41XEz01uQeFKieLwiz0gRGlFZgznXj7eJEONT5W',_binary '','EMPRESA'),('softlab@empresa.com','$2a$10$VdSsfEqLV4wny.1.7wai1OcLj/HOtCjOkSJ0IDJ10gx3RbZ7VZVkW',_binary '','EMPRESA'),('websoftcr@empresa.com','$2a$10$nygYr1XH5/IeRfpvZV87pe7Zw4.4kXOye1Lx/CBwBvegasjP3stgy',_binary '\0','EMPRESA');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-26 23:33:34
