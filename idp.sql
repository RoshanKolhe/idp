-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 01, 2025 at 11:42 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `idp`
--

-- --------------------------------------------------------

--
-- Table structure for table `aimodel`
--

CREATE TABLE `aimodel` (
  `id` int(11) NOT NULL,
  `modelName` varchar(512) NOT NULL,
  `modelValue` varchar(512) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL,
  `remark` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aimodel`
--

INSERT INTO `aimodel` (`id`, `modelName`, `modelValue`, `createdAt`, `updatedAt`, `deletedAt`, `isDeleted`, `isActive`, `remark`) VALUES
(1, 'ML', 'ml', '2025-06-04 09:14:50', '2025-06-04 09:14:50', NULL, 0, 0, NULL),
(2, 'GEN AI', 'genai', '2025-06-04 09:16:51', '2025-06-04 09:16:51', NULL, 0, 1, NULL),
(3, 'Computer Vision', 'computervision', '2025-06-04 09:17:35', '2025-06-04 09:17:35', NULL, 0, 0, NULL),
(4, 'NLP', 'nlp', '2025-06-04 09:18:02', '2025-06-04 09:18:02', NULL, 0, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `blueprint`
--

CREATE TABLE `blueprint` (
  `id` int(11) NOT NULL,
  `bluePrint` text NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL,
  `remark` varchar(512) DEFAULT NULL,
  `processesId` int(11) DEFAULT NULL,
  `edges` text NOT NULL,
  `nodes` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blueprint`
--

INSERT INTO `blueprint` (`id`, `bluePrint`, `createdAt`, `updatedAt`, `deletedAt`, `isDeleted`, `isActive`, `remark`, `processesId`, `edges`, `nodes`) VALUES
(2, '[{\"nodeName\":\"Ingestion\",\"component\":{\"channelType\":\"ui\",\"path\":\"upload/ingestion\",\"host\":\"69.62.81.68\",\"userName\":\"ftpuser\",\"password\":\"\",\"url\":\"\"}},{\"nodeName\":\"Classify\",\"component\":{\"model\":\"genai\",\"categories\":[{\"id\":5,\"documentType\":\"MOA\",\"sampleDocument\":{\"fileUrl\":\"http://localhost:3057/files/20250609T055724396Z_20250609T055444331Z_Feedback (1).docx\",\"fileName\":\"20250609T055444331Z_Feedback (1).docx\",\"size\":2631326},\"description\":\"Memorandum of Association\",\"createdAt\":\"2025-06-09T05:57:25.000Z\",\"updatedAt\":\"2025-06-09T05:57:25.000Z\",\"deletedAt\":null,\"isDeleted\":false,\"isActive\":true,\"remark\":null},{\"id\":6,\"documentType\":\"Aadhar Card\",\"sampleDocument\":{\"fileUrl\":\"http://localhost:3057/files/20250611T114037391Z_Aadhar (3).pdf\",\"fileName\":\"Aadhar (3).pdf\",\"size\":574687},\"description\":\"Aadhar Card\",\"createdAt\":\"2025-06-11T11:40:39.000Z\",\"updatedAt\":\"2025-06-11T11:40:39.000Z\",\"deletedAt\":null,\"isDeleted\":false,\"isActive\":true,\"remark\":null}]}},{\"nodeName\":\"Extract\",\"component\":{\"categories\":[{\"id\":5,\"documentType\":\"MOA\",\"sampleDocument\":{\"fileUrl\":\"http://localhost:3057/files/20250609T055724396Z_20250609T055444331Z_Feedback (1).docx\",\"fileName\":\"20250609T055444331Z_Feedback (1).docx\",\"size\":2631326},\"description\":\"Memorandum of Association\",\"createdAt\":\"2025-06-09T05:57:25.000Z\",\"updatedAt\":\"2025-06-09T05:57:25.000Z\",\"deletedAt\":null,\"isDeleted\":false,\"isActive\":true,\"remark\":null},{\"id\":6,\"documentType\":\"Aadhar Card\",\"sampleDocument\":{\"fileUrl\":\"http://localhost:3057/files/20250611T114037391Z_Aadhar (3).pdf\",\"fileName\":\"Aadhar (3).pdf\",\"size\":574687},\"description\":\"Aadhar Card\",\"createdAt\":\"2025-06-11T11:40:39.000Z\",\"updatedAt\":\"2025-06-11T11:40:39.000Z\",\"deletedAt\":null,\"isDeleted\":false,\"isActive\":true,\"remark\":null}],\"extractors\":{\"5\":\"genai\",\"6\":\"genai\"},\"extractorFields\":{\"5\":[{\"prompt\":\"Company name to be extracted\",\"variableName\":\"Company_name\"}],\"6\":[{\"prompt\":\"User name to be extracted\",\"variableName\":\"user_name\"}]}}},{\"nodeName\":\"Validate\",\"component\":{\"method\":\"auto\"}},{\"nodeName\":\"Deliver\",\"component\":{\"channelType\":\"ftp\",\"path\":\"ftp://server\",\"url\":\"\"}}]', '2025-06-19 11:24:46', '2025-07-28 09:52:10', NULL, 0, 1, NULL, 2, '[{\"id\":\"e1-2\",\"source\":\"1\",\"target\":\"2\",\"animated\":true,\"style\":{\"stroke\":\"black\"}},{\"id\":\"e2-3\",\"source\":\"2\",\"target\":\"3\",\"animated\":true,\"style\":{\"stroke\":\"black\"}},{\"id\":\"e3-4\",\"source\":\"3\",\"target\":\"4\",\"animated\":true,\"style\":{\"stroke\":\"black\"}},{\"id\":\"e4-5\",\"source\":\"4\",\"target\":\"5\",\"animated\":true,\"style\":{\"stroke\":\"black\"}},{\"id\":\"e5-6\",\"source\":\"5\",\"target\":\"6\",\"animated\":true,\"style\":{\"stroke\":\"black\"}}]', '[{\"id\":\"1\",\"type\":\"ingestion\",\"data\":{\"id\":\"1\",\"label\":\"Ingestion\",\"icon\":\"/assets/icons/document-process/ignestion.svg\",\"style\":{\"border\":\"5px solid #2DCA73\",\"borderRight\":\"5px solid white\"},\"functions\":{},\"bluePrint\":{\"channelType\":\"ftp\",\"path\":\"upload/ingestion\",\"host\":\"69.62.81.68\",\"userName\":\"ftpuser\",\"password\":\"XDhtF7jmd6GG2UsZoNhRVDDGNYQqD4yfcFmGdGWE9D0=\",\"url\":\"\"}},\"position\":{\"x\":0,\"y\":0},\"width\":250,\"height\":440,\"selected\":true},{\"id\":\"2\",\"type\":\"classify\",\"data\":{\"id\":\"2\",\"label\":\"Classify\",\"icon\":\"/assets/icons/document-process/classify.svg\",\"style\":{\"border\":\"5px solid #0AAFFF\",\"borderTop\":\"5px dashed lightgray\",\"borderLeft\":\"5px dashed lightgray\"},\"functions\":{},\"bluePrint\":{\"model\":\"genai\",\"categories\":[{\"id\":5,\"documentType\":\"MOA\",\"sampleDocument\":{\"fileUrl\":\"http://localhost:3057/files/20250609T055724396Z_20250609T055444331Z_Feedback (1).docx\",\"fileName\":\"20250609T055444331Z_Feedback (1).docx\",\"size\":2631326},\"description\":\"Memorandum of Association\",\"createdAt\":\"2025-06-09T05:57:25.000Z\",\"updatedAt\":\"2025-06-09T05:57:25.000Z\",\"deletedAt\":null,\"isDeleted\":false,\"isActive\":true,\"remark\":null},{\"id\":6,\"documentType\":\"Aadhar Card\",\"sampleDocument\":{\"fileUrl\":\"http://localhost:3057/files/20250611T114037391Z_Aadhar (3).pdf\",\"fileName\":\"Aadhar (3).pdf\",\"size\":574687},\"description\":\"Aadhar Card\",\"createdAt\":\"2025-06-11T11:40:39.000Z\",\"updatedAt\":\"2025-06-11T11:40:39.000Z\",\"deletedAt\":null,\"isDeleted\":false,\"isActive\":true,\"remark\":null}]}},\"position\":{\"x\":310,\"y\":0},\"width\":250,\"height\":642,\"selected\":false},{\"id\":\"3\",\"type\":\"extract\",\"data\":{\"id\":\"3\",\"label\":\"Extract\",\"icon\":\"/assets/icons/document-process/extract.svg\",\"style\":{\"border\":\"5px solid #FFC113\",\"borderBottom\":\"5px dashed lightgray\",\"borderRight\":\"5px dashed lightgray\"},\"functions\":{},\"bluePrint\":{\"categories\":[{\"id\":5,\"documentType\":\"MOA\",\"sampleDocument\":{\"fileUrl\":\"http://localhost:3057/files/20250609T055724396Z_20250609T055444331Z_Feedback (1).docx\",\"fileName\":\"20250609T055444331Z_Feedback (1).docx\",\"size\":2631326},\"description\":\"Memorandum of Association\",\"createdAt\":\"2025-06-09T05:57:25.000Z\",\"updatedAt\":\"2025-06-09T05:57:25.000Z\",\"deletedAt\":null,\"isDeleted\":false,\"isActive\":true,\"remark\":null},{\"id\":6,\"documentType\":\"Aadhar Card\",\"sampleDocument\":{\"fileUrl\":\"http://localhost:3057/files/20250611T114037391Z_Aadhar (3).pdf\",\"fileName\":\"Aadhar (3).pdf\",\"size\":574687},\"description\":\"Aadhar Card\",\"createdAt\":\"2025-06-11T11:40:39.000Z\",\"updatedAt\":\"2025-06-11T11:40:39.000Z\",\"deletedAt\":null,\"isDeleted\":false,\"isActive\":true,\"remark\":null}],\"extractors\":{\"5\":\"genai\",\"6\":\"genai\"},\"extractorFields\":{\"5\":[{\"prompt\":\"Company name to be extracted\",\"variableName\":\"Company_name\"}],\"6\":[{\"prompt\":\"User name to be extracted\",\"variableName\":\"user_name\"}]}}},\"position\":{\"x\":640,\"y\":0},\"width\":250,\"height\":596,\"selected\":false},{\"id\":\"4\",\"type\":\"validate\",\"data\":{\"id\":\"4\",\"label\":\"Validate\",\"icon\":\"/assets/icons/document-process/validate.svg\",\"style\":{\"border\":\"5px solid #ED63D2\",\"borderTop\":\"5px dashed lightgray\",\"borderLeft\":\"5px dashed lightgray\"},\"functions\":{},\"bluePrint\":{\"method\":\"auto\"}},\"position\":{\"x\":970,\"y\":0},\"width\":250,\"height\":470,\"selected\":false},{\"id\":\"5\",\"type\":\"deliver\",\"data\":{\"id\":\"5\",\"label\":\"Deliver\",\"icon\":\"/assets/icons/document-process/deliver.svg\",\"style\":{\"border\":\"5px solid #7551E9\",\"borderBottom\":\"5px dashed lightgray\",\"borderRight\":\"5px dashed lightgray\"},\"functions\":{},\"bluePrint\":{\"channelType\":\"ftp\",\"path\":\"ftp://server\",\"url\":\"\"}},\"position\":{\"x\":1300,\"y\":0},\"width\":250,\"height\":472,\"selected\":false},{\"id\":\"6\",\"type\":\"customAddNode\",\"data\":{\"id\":\"6\",\"label\":\"➕ New Node\",\"icon\":\"/assets/icons/document-process/add.svg\",\"style\":{\"border\":\"5px solid #2DCA73\",\"borderTop\":\"5px solid white\",\"borderLeft\":\"5px solid white\"},\"functions\":{}},\"position\":{\"x\":1650,\"y\":0},\"width\":140,\"height\":298}]'),
(3, '[{\"nodeName\":\"Ingestion\",\"component\":{\"channelType\":\"api\",\"path\":\"\",\"host\":\"\",\"userName\":\"\",\"password\":\"\",\"url\":\"\"}},{\"nodeName\":\"Classify\",\"component\":{\"model\":\"genai\",\"categories\":[{\"id\":5,\"documentType\":\"MOA\",\"sampleDocument\":{\"fileUrl\":\"http://localhost:3057/files/20250609T055724396Z_20250609T055444331Z_Feedback (1).docx\",\"fileName\":\"20250609T055444331Z_Feedback (1).docx\",\"size\":2631326},\"description\":\"Memorandum of Association\",\"createdAt\":\"2025-06-09T05:57:25.000Z\",\"updatedAt\":\"2025-06-09T05:57:25.000Z\",\"deletedAt\":null,\"isDeleted\":false,\"isActive\":true,\"remark\":null},{\"id\":6,\"documentType\":\"Aadhar Card\",\"sampleDocument\":{\"fileUrl\":\"http://localhost:3057/files/20250611T114037391Z_Aadhar (3).pdf\",\"fileName\":\"Aadhar (3).pdf\",\"size\":574687},\"description\":\"Aadhar Card\",\"createdAt\":\"2025-06-11T11:40:39.000Z\",\"updatedAt\":\"2025-06-11T11:40:39.000Z\",\"deletedAt\":null,\"isDeleted\":false,\"isActive\":true,\"remark\":null}]}},{\"nodeName\":\"Extract\",\"component\":{\"categories\":[{\"id\":5,\"documentType\":\"MOA\",\"sampleDocument\":{\"fileUrl\":\"http://localhost:3057/files/20250609T055724396Z_20250609T055444331Z_Feedback (1).docx\",\"fileName\":\"20250609T055444331Z_Feedback (1).docx\",\"size\":2631326},\"description\":\"Memorandum of Association\",\"createdAt\":\"2025-06-09T05:57:25.000Z\",\"updatedAt\":\"2025-06-09T05:57:25.000Z\",\"deletedAt\":null,\"isDeleted\":false,\"isActive\":true,\"remark\":null},{\"id\":6,\"documentType\":\"Aadhar Card\",\"sampleDocument\":{\"fileUrl\":\"http://localhost:3057/files/20250611T114037391Z_Aadhar (3).pdf\",\"fileName\":\"Aadhar (3).pdf\",\"size\":574687},\"description\":\"Aadhar Card\",\"createdAt\":\"2025-06-11T11:40:39.000Z\",\"updatedAt\":\"2025-06-11T11:40:39.000Z\",\"deletedAt\":null,\"isDeleted\":false,\"isActive\":true,\"remark\":null}],\"extractors\":{\"5\":\"genai\",\"6\":\"genai\"},\"extractorFields\":{\"5\":[{\"prompt\":\"Company name to be extracted\",\"variableName\":\"Company_name\"},{\"prompt\":\"Company owner name to be extracted\",\"variableName\":\"Company_owner_name\"}],\"6\":[{\"prompt\":\"User name to be extracted\",\"variableName\":\"user_name\"}]}}},{\"nodeName\":\"Validate\",\"component\":{\"method\":\"auto\"}},{\"nodeName\":\"Deliver\",\"component\":{\"channelType\":\"ftp\",\"path\":\"upload/ingestion\",\"host\":\"69.62.81.68\",\"userName\":\"username\",\"password\":\"Admin@123\",\"url\":\"\"}}]', '2025-07-03 06:40:54', '2025-07-28 07:28:14', NULL, 0, 1, NULL, 3, '[{\"id\":\"e1-2\",\"source\":\"1\",\"target\":\"2\",\"animated\":true,\"style\":{\"stroke\":\"black\"}},{\"id\":\"e2-3\",\"source\":\"2\",\"target\":\"3\",\"animated\":true,\"style\":{\"stroke\":\"black\"}},{\"id\":\"e3-4\",\"source\":\"3\",\"target\":\"4\",\"animated\":true,\"style\":{\"stroke\":\"black\"}},{\"id\":\"e4-5\",\"source\":\"4\",\"target\":\"5\",\"animated\":true,\"style\":{\"stroke\":\"black\"}},{\"id\":\"e5-6\",\"source\":\"5\",\"target\":\"6\",\"animated\":true,\"style\":{\"stroke\":\"black\"}}]', '[{\"id\":\"1\",\"type\":\"ingestion\",\"data\":{\"id\":\"1\",\"label\":\"Ingestion\",\"icon\":\"/assets/icons/document-process/ignestion.svg\",\"style\":{\"border\":\"5px solid #2DCA73\",\"borderRight\":\"5px solid white\"},\"functions\":{},\"bluePrint\":{\"channelType\":\"ui\",\"path\":\"\",\"host\":\"\",\"userName\":\"\",\"password\":\"\",\"url\":\"\"}},\"position\":{\"x\":0,\"y\":0},\"width\":250,\"height\":440,\"selected\":false},{\"id\":\"2\",\"type\":\"classify\",\"data\":{\"id\":\"2\",\"label\":\"Classify\",\"icon\":\"/assets/icons/document-process/classify.svg\",\"style\":{\"border\":\"5px solid #0AAFFF\",\"borderTop\":\"5px dashed lightgray\",\"borderLeft\":\"5px dashed lightgray\"},\"functions\":{},\"bluePrint\":{\"model\":\"genai\",\"categories\":[{\"id\":5,\"documentType\":\"MOA\",\"sampleDocument\":{\"fileUrl\":\"http://localhost:3057/files/20250609T055724396Z_20250609T055444331Z_Feedback (1).docx\",\"fileName\":\"20250609T055444331Z_Feedback (1).docx\",\"size\":2631326},\"description\":\"Memorandum of Association\",\"createdAt\":\"2025-06-09T05:57:25.000Z\",\"updatedAt\":\"2025-06-09T05:57:25.000Z\",\"deletedAt\":null,\"isDeleted\":false,\"isActive\":true,\"remark\":null},{\"id\":6,\"documentType\":\"Aadhar Card\",\"sampleDocument\":{\"fileUrl\":\"http://localhost:3057/files/20250611T114037391Z_Aadhar (3).pdf\",\"fileName\":\"Aadhar (3).pdf\",\"size\":574687},\"description\":\"Aadhar Card\",\"createdAt\":\"2025-06-11T11:40:39.000Z\",\"updatedAt\":\"2025-06-11T11:40:39.000Z\",\"deletedAt\":null,\"isDeleted\":false,\"isActive\":true,\"remark\":null}]}},\"position\":{\"x\":310,\"y\":0},\"width\":250,\"height\":642,\"selected\":false},{\"id\":\"3\",\"type\":\"extract\",\"data\":{\"id\":\"3\",\"label\":\"Extract\",\"icon\":\"/assets/icons/document-process/extract.svg\",\"style\":{\"border\":\"5px solid #FFC113\",\"borderBottom\":\"5px dashed lightgray\",\"borderRight\":\"5px dashed lightgray\"},\"functions\":{},\"bluePrint\":{\"categories\":[{\"id\":5,\"documentType\":\"MOA\",\"sampleDocument\":{\"fileUrl\":\"http://localhost:3057/files/20250609T055724396Z_20250609T055444331Z_Feedback (1).docx\",\"fileName\":\"20250609T055444331Z_Feedback (1).docx\",\"size\":2631326},\"description\":\"Memorandum of Association\",\"createdAt\":\"2025-06-09T05:57:25.000Z\",\"updatedAt\":\"2025-06-09T05:57:25.000Z\",\"deletedAt\":null,\"isDeleted\":false,\"isActive\":true,\"remark\":null},{\"id\":6,\"documentType\":\"Aadhar Card\",\"sampleDocument\":{\"fileUrl\":\"http://localhost:3057/files/20250611T114037391Z_Aadhar (3).pdf\",\"fileName\":\"Aadhar (3).pdf\",\"size\":574687},\"description\":\"Aadhar Card\",\"createdAt\":\"2025-06-11T11:40:39.000Z\",\"updatedAt\":\"2025-06-11T11:40:39.000Z\",\"deletedAt\":null,\"isDeleted\":false,\"isActive\":true,\"remark\":null}],\"extractors\":{\"5\":\"genai\",\"6\":\"genai\"},\"extractorFields\":{\"5\":[{\"prompt\":\"Company name to be extracted\",\"variableName\":\"Company_name\"},{\"prompt\":\"Company owner name to be extracted\",\"variableName\":\"Company_owner_name\"}],\"6\":[{\"prompt\":\"User name to be extracted\",\"variableName\":\"user_name\"}]}}},\"position\":{\"x\":640,\"y\":0},\"width\":250,\"height\":596,\"selected\":false},{\"id\":\"4\",\"type\":\"validate\",\"data\":{\"id\":\"4\",\"label\":\"Validate\",\"icon\":\"/assets/icons/document-process/validate.svg\",\"style\":{\"border\":\"5px solid #ED63D2\",\"borderTop\":\"5px dashed lightgray\",\"borderLeft\":\"5px dashed lightgray\"},\"functions\":{},\"bluePrint\":{\"method\":\"auto\"}},\"position\":{\"x\":970,\"y\":0},\"width\":250,\"height\":470,\"selected\":true},{\"id\":\"5\",\"type\":\"deliver\",\"data\":{\"id\":\"5\",\"label\":\"Deliver\",\"icon\":\"/assets/icons/document-process/deliver.svg\",\"style\":{\"border\":\"5px solid #7551E9\",\"borderBottom\":\"5px dashed lightgray\",\"borderRight\":\"5px dashed lightgray\"},\"functions\":{},\"bluePrint\":{\"channelType\":\"ftp\",\"path\":\"upload/ingestion\",\"host\":\"69.62.81.68\",\"userName\":\"username\",\"password\":\"Admin@123\",\"url\":\"\"}},\"position\":{\"x\":1300,\"y\":0},\"width\":250,\"height\":472,\"selected\":false},{\"id\":\"6\",\"type\":\"customAddNode\",\"data\":{\"id\":\"6\",\"label\":\"➕ New Node\",\"icon\":\"/assets/icons/document-process/add.svg\",\"style\":{\"border\":\"5px solid #2DCA73\",\"borderTop\":\"5px solid white\",\"borderLeft\":\"5px solid white\"},\"functions\":{}},\"position\":{\"x\":1650,\"y\":0},\"width\":140,\"height\":298}]'),
(4, '[{\"nodeName\":\"Ingestion\",\"component\":{\"channelType\":\"api\",\"path\":\"\",\"host\":\"\",\"userName\":\"\",\"password\":\"\",\"url\":\"\"}}]', '2025-07-28 11:01:04', '2025-07-28 11:01:04', NULL, 0, 1, NULL, 4, '[{\"id\":\"e1-2\",\"source\":\"1\",\"target\":\"2\",\"animated\":true,\"style\":{\"stroke\":\"black\"}}]', '[{\"id\":\"1\",\"type\":\"ingestion\",\"data\":{\"id\":\"1\",\"label\":\"Ingestion\",\"icon\":\"/assets/icons/document-process/ignestion.svg\",\"style\":{\"border\":\"5px solid #2DCA73\",\"borderRight\":\"5px solid white\"},\"functions\":{}},\"position\":{\"x\":0,\"y\":0},\"width\":250,\"height\":440,\"selected\":false},{\"id\":\"2\",\"type\":\"customAddNode\",\"data\":{\"id\":\"2\",\"label\":\"New Node\",\"icon\":\"/assets/icons/document-process/add.svg\",\"style\":{\"border\":\"5px solid \",\"borderTop\":\"5px solid white\",\"borderLeft\":\"5px solid white\"},\"functions\":{}},\"position\":{\"x\":330,\"y\":0},\"width\":140,\"height\":298,\"selected\":true}]');

-- --------------------------------------------------------

--
-- Table structure for table `documenttype`
--

CREATE TABLE `documenttype` (
  `id` int(11) NOT NULL,
  `documentType` varchar(512) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL,
  `remark` varchar(512) DEFAULT NULL,
  `sampleDocument` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `documenttype`
--

INSERT INTO `documenttype` (`id`, `documentType`, `description`, `createdAt`, `updatedAt`, `deletedAt`, `isDeleted`, `isActive`, `remark`, `sampleDocument`) VALUES
(5, 'MOA', 'Memorandum of Association', '2025-06-09 05:57:25', '2025-06-09 05:57:25', NULL, 0, 1, NULL, '{\"fileUrl\":\"http://localhost:3057/files/20250609T055724396Z_20250609T055444331Z_Feedback (1).docx\",\"fileName\":\"20250609T055444331Z_Feedback (1).docx\",\"size\":2631326}'),
(6, 'Aadhar Card', 'Aadhar Card', '2025-06-11 11:40:39', '2025-06-11 11:40:39', NULL, 0, 1, NULL, '{\"fileUrl\":\"http://localhost:3057/files/20250611T114037391Z_Aadhar (3).pdf\",\"fileName\":\"Aadhar (3).pdf\",\"size\":574687}');

-- --------------------------------------------------------

--
-- Table structure for table `filetype`
--

CREATE TABLE `filetype` (
  `id` int(11) NOT NULL,
  `fileType` varchar(512) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL,
  `remark` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ingestionchanneltype`
--

CREATE TABLE `ingestionchanneltype` (
  `id` int(11) NOT NULL,
  `channelType` varchar(512) NOT NULL,
  `channelValue` varchar(512) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL,
  `remark` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ingestionchanneltype`
--

INSERT INTO `ingestionchanneltype` (`id`, `channelType`, `channelValue`, `description`, `createdAt`, `updatedAt`, `deletedAt`, `isDeleted`, `isActive`, `remark`) VALUES
(1, 'FTP', 'ftp', 'FTP method', '2025-06-04 07:50:29', '2025-06-04 07:50:29', NULL, 0, 1, NULL),
(2, 'API', 'api', 'API method', '2025-06-04 08:33:11', '2025-06-04 08:33:11', NULL, 0, 0, NULL),
(3, 'HTTP/HTTPS', 'http/https', 'HTTP & HTTPS method', '2025-06-04 08:34:51', '2025-06-04 08:34:51', NULL, 0, 0, NULL),
(4, 'UI/PORTAL', 'ui/portal', 'UI PORTAL method', '2025-06-04 08:35:46', '2025-06-04 08:35:46', NULL, 0, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `processes`
--

CREATE TABLE `processes` (
  `id` int(11) NOT NULL,
  `name` varchar(512) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL,
  `remark` varchar(512) DEFAULT NULL,
  `processTypeId` int(11) DEFAULT NULL,
  `bluePrintId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `processes`
--

INSERT INTO `processes` (`id`, `name`, `description`, `createdAt`, `updatedAt`, `deletedAt`, `isDeleted`, `isActive`, `remark`, `processTypeId`, `bluePrintId`) VALUES
(2, 'Process 1', 'New Process for testing', '2025-06-19 10:26:16', '2025-06-19 11:24:46', NULL, 0, 1, NULL, 1, 2),
(3, 'Process 3', 'New UI Portal Process', '2025-07-03 06:36:59', '2025-07-03 06:40:54', NULL, 0, 1, NULL, 1, 3),
(4, 'test - product', 'new tool', '2025-07-28 11:00:46', '2025-07-28 11:01:04', NULL, 0, 1, NULL, 1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `processinstancedocuments`
--

CREATE TABLE `processinstancedocuments` (
  `id` int(11) NOT NULL,
  `documentDetails` text NOT NULL,
  `processInstancesId` int(11) DEFAULT NULL,
  `documentTypeId` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL,
  `remark` varchar(512) DEFAULT NULL,
  `fileDetails` text NOT NULL,
  `extractedFields` text NOT NULL,
  `isHumanUpdated` tinyint(1) DEFAULT NULL,
  `overAllScore` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `processinstancedocuments`
--

INSERT INTO `processinstancedocuments` (`id`, `documentDetails`, `processInstancesId`, `documentTypeId`, `createdAt`, `updatedAt`, `deletedAt`, `isDeleted`, `isActive`, `remark`, `fileDetails`, `extractedFields`, `isHumanUpdated`, `overAllScore`) VALUES
(1, '{\"documentName\":\"0659507760226420190320151119_03052025125131.pdf\",\"documentType\":\"aadhar-card\"}', 1, 0, '2025-06-25 10:05:39', '2025-07-05 17:07:52', NULL, 0, 1, NULL, '{\"fieldname\":\"file\",\"fileName\":\"20250620T075743868Z_545646654654546_7676566_009 12.01.16â¯PM.pdf\",\"newFileName\":\"20250625T095547309Z_20250620T075743868Z_545646654654546_7676566_009 12.01.16â¯PM.pdf\",\"fileUrl\":\"http://localhost:3057/files/file/20250625T095547309Z_20250620T075743868Z_545646654654546_7676566_009%2012.01.16%C3%A2%C2%80%C2%AFPM.pdf\",\"encoding\":\"7bit\",\"mimetype\":\"application/pdf\",\"size\":685521}', '[{\"fieldName\":\"User Name\",\"fieldValue\":\"Indave Siddhant Sushilkar\"},{\"fieldName\":\"User Address\",\"fieldValue\":\"FLAT NO 01, SHYAM HARMONY APARTMENT, ASHOKA MARG, BEHIND INOX THEATRE, KALPATARU NAGAR, Nashik, Dwarka Corner, Sub District: Nashik, District: Nashik, Maharashtra, 422011\"}]', 0, 100),
(2, '{\"documentName\":\"0659507760226420190320151119_03052025125131.pdf\",\"documentType\":\"moa\"}', 1, NULL, '2025-06-26 09:11:44', '2025-06-27 08:54:35', NULL, 0, 1, NULL, '{\"fieldname\":\"file\",\"fileName\":\"20250620T075726143Z_20250607T071001095Z_Alteredmemorandumofassociation-25062021 12.01.37â¯PM.pdf\",\"newFileName\":\"20250626T090821876Z_20250620T075726143Z_20250607T071001095Z_Alteredmemorandumofassociation-25062021 12.01.37â¯PM.pdf\",\"fileUrl\":\"http://localhost:3057/files/file?path=20250626T090821876Z_20250620T075726143Z_20250607T071001095Z_Alteredmemorandumofassociation-25062021%2012.01.37%C3%A2%C2%80%C2%AFPM.pdf\",\"encoding\":\"7bit\",\"mimetype\":\"application/pdf\",\"size\":2583493}', '[{\"fieldName\":\"User Name\",\"fieldValue\":\"Sid\"},{\"fieldName\":\"User Address\",\"fieldValue\":\"FLAT NO 01, SHYAM HARMONY APARTMENT, ASHOKA MARG, BEHIND INOX THEATRE, KALPATARU NAGAR, Nashik, Dwarka Corner, Sub District: Nashik, District: Nashik, Maharashtra, 422011\"}]', 1, 100);

-- --------------------------------------------------------

--
-- Table structure for table `processinstances`
--

CREATE TABLE `processinstances` (
  `id` int(11) NOT NULL,
  `processInstanceName` varchar(512) NOT NULL,
  `processInstanceDescription` varchar(512) DEFAULT NULL,
  `currentStage` varchar(512) DEFAULT NULL,
  `isInstanceRunning` tinyint(1) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL,
  `remark` varchar(512) DEFAULT NULL,
  `processesId` int(11) DEFAULT NULL,
  `processInstanceFolderName` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `processinstances`
--

INSERT INTO `processinstances` (`id`, `processInstanceName`, `processInstanceDescription`, `currentStage`, `isInstanceRunning`, `createdAt`, `updatedAt`, `deletedAt`, `isDeleted`, `isActive`, `remark`, `processesId`, `processInstanceFolderName`) VALUES
(1, 'New Process Instance 1', 'Process Instance 1', NULL, 0, '2025-06-19 07:34:22', '2025-06-19 07:34:22', NULL, 0, 1, NULL, 1, NULL),
(2, 'New Process Instance 2', '', NULL, 0, '2025-06-19 11:52:33', '2025-06-19 11:54:01', NULL, 0, 1, NULL, 1, NULL),
(4, 'Process Instance 5', 'Process 1', NULL, 0, '2025-07-03 05:08:11', '2025-07-03 05:08:11', NULL, 0, 1, NULL, 1, 'process-instance-5'),
(5, 'Process Instance 6', 'process instance 6', NULL, 0, '2025-07-03 06:20:45', '2025-07-03 06:20:45', NULL, 0, 1, NULL, 1, 'process-instance-6'),
(6, 'Process Instance 7', 'Process Description', NULL, 0, '2025-07-03 06:34:24', '2025-07-03 06:34:24', NULL, 0, 1, NULL, 1, 'process-instance-7'),
(7, 'Process Instance 8', 'process desc', NULL, 0, '2025-07-03 06:35:24', '2025-07-03 06:35:24', NULL, 0, 1, NULL, 1, 'process-instance-8'),
(8, 'Process Instance 9', 'process desc', NULL, 0, '2025-07-03 06:36:21', '2025-07-03 06:36:21', NULL, 0, 1, NULL, 1, 'process-instance-9'),
(9, 'Process Instance 10', 'process description', NULL, 0, '2025-07-03 06:41:19', '2025-07-03 06:41:19', NULL, 0, 1, NULL, 3, 'process-instance-10'),
(10, 'Process Instance 11', 'desc', NULL, 0, '2025-07-03 06:48:10', '2025-07-03 06:48:10', NULL, 0, 1, NULL, 3, 'process-instance-11'),
(11, 'Process Instance 12', 'desc', NULL, 0, '2025-07-03 06:49:03', '2025-07-03 06:49:03', NULL, 0, 1, NULL, 3, 'process-instance-12'),
(12, 'Process Instance 13', 'desc', NULL, 0, '2025-07-03 06:51:39', '2025-07-03 06:51:39', NULL, 0, 1, NULL, 3, 'process-instance-13'),
(13, 'Process Instance 14', 'desc', NULL, 0, '2025-07-03 06:53:01', '2025-07-03 06:53:01', NULL, 0, 1, NULL, 3, 'process-instance-14'),
(14, 'Process Instance 15', 'process 5', NULL, 0, '2025-07-03 08:42:32', '2025-07-03 08:57:35', NULL, 0, 1, NULL, 3, 'process-instance-15'),
(15, 'Process Instance 20', 'desc', NULL, 0, '2025-07-03 08:58:07', '2025-07-28 07:30:37', NULL, 0, 1, NULL, 3, 'process-instance-20'),
(16, 'New Process Instance of API', 'new one', NULL, 0, '2025-07-28 09:45:39', '2025-07-28 09:45:39', NULL, 0, 1, NULL, 3, NULL),
(17, 'New Process Instance of API 1', 'desc', NULL, 0, '2025-07-28 09:46:29', '2025-07-28 09:46:29', NULL, 0, 1, NULL, 3, NULL),
(18, 'New Process Instance of API 2', 'desc', NULL, 0, '2025-07-28 09:47:58', '2025-07-28 09:47:58', NULL, 0, 1, NULL, 3, 'new-process-instance-of-api-2'),
(19, 'New Process Instance of API 3', 'desc', NULL, 0, '2025-07-28 09:48:49', '2025-07-28 09:48:49', NULL, 0, 1, NULL, 3, 'new-process-instance-of-api-3'),
(20, 'New Process Instance of API 5', 'desc', NULL, 0, '2025-07-28 09:51:39', '2025-07-28 09:51:39', NULL, 0, 1, NULL, 3, 'new-process-instance-of-api-5'),
(21, 'New Process Instance UI', 'desc', NULL, 0, '2025-07-28 09:53:33', '2025-07-28 09:53:33', NULL, 0, 1, NULL, 2, 'new-process-instance-ui'),
(22, 'New Process Instance API - 10', 'desc', NULL, 0, '2025-07-28 10:16:32', '2025-07-28 10:16:32', NULL, 0, 1, NULL, 3, 'new-process-instance-api-10'),
(23, 'New Process Instance API - 101', 'desc', NULL, 0, '2025-07-28 10:57:28', '2025-07-28 10:57:28', NULL, 0, 1, NULL, 3, 'new-process-instance-api-101'),
(24, 'New Process Instance 76', 'test', NULL, 0, '2025-07-28 11:01:44', '2025-07-28 11:01:44', NULL, 0, 1, NULL, 4, 'new-process-instance-76');

-- --------------------------------------------------------

--
-- Table structure for table `processinstancesecrets`
--

CREATE TABLE `processinstancesecrets` (
  `id` int(11) NOT NULL,
  `processInstancesId` int(11) DEFAULT NULL,
  `secretKey` varchar(512) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `remark` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `processinstancesecrets`
--

INSERT INTO `processinstancesecrets` (`id`, `processInstancesId`, `secretKey`, `createdAt`, `updatedAt`, `remark`) VALUES
(1, 19, 'bfe418db8936741d94aa6947cb7d6cddbc5ea4f73972a06365ad22af4cc2aab6', '2025-07-28 09:48:49', '2025-07-28 09:48:49', NULL),
(2, 20, 'c70f1768d9099716b657b1da538bc0cb682d69de271861b8a79c2bec16cbf5db', '2025-07-28 09:51:39', '2025-07-28 09:51:39', NULL),
(3, 22, '9817522a73bccc13881d6fdeb96db5713550fd67fe555c1880a86aa6ea65aee6', '2025-07-28 10:16:32', '2025-07-28 10:16:32', NULL),
(4, 23, '2c67fd8c4dcbeda5c3419dfc8d59506ec1855b4d5e205959c9d72d7d6d9ceea4', '2025-07-28 10:57:28', '2025-07-28 10:57:28', NULL),
(5, 24, '86c57235e92571e0a02614bbb3fa5ea20e8d0aee95ad8757189eebc0eda1f793', '2025-07-28 11:01:44', '2025-07-28 11:01:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `processtype`
--

CREATE TABLE `processtype` (
  `id` int(11) NOT NULL,
  `processType` varchar(512) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL,
  `remark` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `processtype`
--

INSERT INTO `processtype` (`id`, `processType`, `description`, `createdAt`, `updatedAt`, `deletedAt`, `isDeleted`, `isActive`, `remark`) VALUES
(1, 'Edtech Onboarding', 'Lorem ipsum dolor sit amet consectetur. Consectetur diam amet massa sagittis pretium enim aliquet eget et.', '2025-05-17 10:18:12', '2025-05-17 10:18:33', NULL, 0, 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `firstName` varchar(512) DEFAULT NULL,
  `lastName` varchar(512) DEFAULT NULL,
  `dob` varchar(512) DEFAULT NULL,
  `fullAddress` varchar(512) DEFAULT NULL,
  `city` varchar(512) DEFAULT NULL,
  `state` varchar(512) DEFAULT NULL,
  `email` varchar(512) DEFAULT NULL,
  `password` varchar(512) DEFAULT NULL,
  `phoneNumber` varchar(512) NOT NULL,
  `avatar` text DEFAULT NULL,
  `permissions` text DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL,
  `otp` varchar(512) DEFAULT NULL,
  `fcmToken` varchar(512) DEFAULT NULL,
  `otpExpireAt` varchar(512) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `firstName`, `lastName`, `dob`, `fullAddress`, `city`, `state`, `email`, `password`, `phoneNumber`, `avatar`, `permissions`, `isActive`, `otp`, `fcmToken`, `otpExpireAt`, `createdAt`, `updatedAt`, `deletedAt`, `isDeleted`) VALUES
(1, 'Karan', 'Rakh', NULL, NULL, NULL, NULL, 'karanrakh19@gmail.com', '$2a$10$gsAiYs8xMBVi0WmOK1/tNOXhqgbeNTFY4NgJOirSiWSHwl78fkJJK', '8888644378', NULL, '[\"super_admin\"]', 1, NULL, NULL, NULL, '2025-05-17 10:15:11', '2025-05-17 10:15:11', NULL, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aimodel`
--
ALTER TABLE `aimodel`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blueprint`
--
ALTER TABLE `blueprint`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `documenttype`
--
ALTER TABLE `documenttype`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `filetype`
--
ALTER TABLE `filetype`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ingestionchanneltype`
--
ALTER TABLE `ingestionchanneltype`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `processes`
--
ALTER TABLE `processes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `processinstancedocuments`
--
ALTER TABLE `processinstancedocuments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `processinstances`
--
ALTER TABLE `processinstances`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `processinstancesecrets`
--
ALTER TABLE `processinstancesecrets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `processtype`
--
ALTER TABLE `processtype`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aimodel`
--
ALTER TABLE `aimodel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `blueprint`
--
ALTER TABLE `blueprint`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `documenttype`
--
ALTER TABLE `documenttype`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `filetype`
--
ALTER TABLE `filetype`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ingestionchanneltype`
--
ALTER TABLE `ingestionchanneltype`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `processes`
--
ALTER TABLE `processes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `processinstancedocuments`
--
ALTER TABLE `processinstancedocuments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `processinstances`
--
ALTER TABLE `processinstances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `processinstancesecrets`
--
ALTER TABLE `processinstancesecrets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `processtype`
--
ALTER TABLE `processtype`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
