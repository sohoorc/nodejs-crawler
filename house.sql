/*
 Navicat Premium Data Transfer

 Source Server         : pi
 Source Server Type    : MySQL
 Source Server Version : 100137
 Source Host           : 192.168.199.156:3306
 Source Schema         : house

 Target Server Type    : MySQL
 Target Server Version : 100137
 File Encoding         : 65001

 Date: 19/12/2018 22:44:38
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for house
-- ----------------------------
DROP TABLE IF EXISTS `house`;
CREATE TABLE `house` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) DEFAULT NULL COMMENT '名称',
  `totalPrice` int(64) DEFAULT NULL COMMENT '总价',
  `orientation` varchar(12) DEFAULT NULL COMMENT '方向',
  `unitPrice` int(11) DEFAULT NULL COMMENT '单价',
  `year` int(5) DEFAULT NULL COMMENT '年代',
  `houseType` varchar(12) DEFAULT NULL COMMENT '类型',
  `district` varchar(32) DEFAULT NULL COMMENT '区域',
  `floor` varchar(12) DEFAULT NULL COMMENT '楼层',
  `coveredArea` float(12,0) DEFAULT NULL COMMENT '总面积',
  `structure` varchar(12) DEFAULT NULL COMMENT '户型结构',
  `insideArea` float(12,0) DEFAULT NULL COMMENT '套内',
  `fitment` varchar(12) DEFAULT NULL COMMENT '装修',
  `thbl` varchar(12) DEFAULT NULL,
  `hasElevator` varchar(6) DEFAULT NULL COMMENT '是否有电梯',
  `property` int(6) DEFAULT NULL COMMENT '产权年限',
  `housePurpose` varchar(6) DEFAULT NULL COMMENT '房屋用途',
  `isFiveYears` varchar(6) DEFAULT NULL COMMENT '年限状态',
  `mortgage` text COMMENT '抵押信息',
  `houseId` bigint(128) NOT NULL,
  PRIMARY KEY (`id`,`houseId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
