/*
 Navicat Premium Data Transfer

 Source Server         : thinktest
 Source Server Type    : MySQL
 Source Server Version : 50542
 Source Host           : 192.168.1.9
 Source Database       : marketing

 Target Server Type    : MySQL
 Target Server Version : 50542
 File Encoding         : utf-8

 Date: 08/02/2017 21:44:22 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `     
tongji`
-- ----------------------------
DROP TABLE IF EXISTS `     
tongji`;
CREATE TABLE `     
tongji` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `openId` varchar(50) DEFAULT NULL,
  `activityId` int(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `activity`
-- ----------------------------
DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `descption` varchar(100) NOT NULL,
  `picUrl` varchar(100) DEFAULT NULL,
  `shareTitle` varchar(50) DEFAULT NULL,
  `shareIcon` varchar(100) DEFAULT NULL,
  `startTime` varchar(50) NOT NULL,
  `endTime` varchar(50) DEFAULT NULL,
  `status` int(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `activity`
-- ----------------------------
BEGIN;
INSERT INTO `activity` VALUES ('13', '活动标题4', '活动内容活动内容。。。。。。', '活动图片', null, null, '1501425974757', '1501545600000', '0');
COMMIT;

-- ----------------------------
--  Table structure for `participator`
-- ----------------------------
DROP TABLE IF EXISTS `participator`;
CREATE TABLE `participator` (
  `userId` varchar(50) DEFAULT NULL,
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `parendId` varchar(50) DEFAULT NULL,
  `activityId` int(100) DEFAULT NULL,
  `status` int(20) DEFAULT NULL,
  `joinTime` time DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `participator`
-- ----------------------------
BEGIN;
INSERT INTO `participator` VALUES ('111', '1', '111', '111', '0', '838:59:59'), ('111', '2', '111', '111', '0', '838:59:59'), ('111', '3', '111', '111', '0', '838:59:59'), ('aa1501394597884', '4', 'aa1501395236744', '111', '1', '838:59:59');
COMMIT;

-- ----------------------------
--  Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `userId` varchar(50) NOT NULL,
  `openId` varchar(50) NOT NULL,
  `userName` varchar(50) NOT NULL,
  `uerPortrait` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `parentId` varchar(255) DEFAULT NULL,
  `nickName` varchar(50) DEFAULT NULL,
  `signTime` time DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `user`
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES ('111', 'asdjfaksadfjk', 'aaaa', 'aaa', '121212', '1212', 'aa', '12:12:12'), ('aa1501394574478', 'aa1501394574478', 'xx', '', '13955781781', 'aa1501394574478', null, '838:59:59'), ('aa1501394597884', 'aa1501394597884', 'xx', '', '18513622821', 'aa1501394597884', 'hahahh哈哈', '838:59:59'), ('aa1501394711189', 'aa1501394711189', 'xx', '', '13955781781', 'aa1501394711189', null, '838:59:59'), ('aa1501394862458', 'aa1501394862458', 'xx', '', '13955781781', 'aa1501394862458', null, '838:59:59'), ('aa1501394864245', 'aa1501394864245', 'xx', '', '13955781781', 'aa1501394864245', null, '838:59:59'), ('aa1501394871626', 'aa1501394871626', 'xx', '', '13955781781', 'aa1501394871626', null, '838:59:59'), ('aa1501394873176', 'aa1501394873176', 'xx', '', '13955781781', 'aa1501394873176', null, '838:59:59'), ('aa1501394878432', 'aa1501394878432', 'xx', '', '13955781781', 'aa1501394878432', null, '838:59:59'), ('aa1501394879582', 'aa1501394879582', 'xx', '', '13955781781', 'aa1501394879582', null, '838:59:59'), ('aa1501394903420', 'aa1501394903420', 'xx', '', '13955781781', 'aa1501394903420', null, '838:59:59'), ('aa1501394918580', 'aa1501394918580', 'xx', '', '13955781781', 'aa1501394918580', null, '838:59:59'), ('aa1501395070149', 'aa1501395070149', 'xx', '', '13955781781', 'aa1501395070149', null, '838:59:59'), ('aa1501395236744', 'aa1501395236744', 'xx', '', '18513622821', 'aa1501395236744', 'hahaha', '838:59:59');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
