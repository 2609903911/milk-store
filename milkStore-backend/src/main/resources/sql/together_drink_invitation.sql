-- 创建一起喝邀请表
CREATE TABLE IF NOT EXISTS `together_drink_invitation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '邀请ID',
  `invite_code` varchar(10) NOT NULL COMMENT '邀请码',
  `creator_id` varchar(64) NOT NULL COMMENT '创建者ID',
  `creator_nickname` varchar(64) DEFAULT NULL COMMENT '创建者昵称',
  `creator_avatar` varchar(255) DEFAULT NULL COMMENT '创建者头像',
  `participant_id` varchar(64) DEFAULT NULL COMMENT '参与者ID',
  `participant_nickname` varchar(64) DEFAULT NULL COMMENT '参与者昵称',
  `participant_avatar` varchar(255) DEFAULT NULL COMMENT '参与者头像',
  `product_id` bigint(20) NOT NULL COMMENT '商品ID',
  `product_name` varchar(128) DEFAULT NULL COMMENT '商品名称',
  `product_price` decimal(10,2) DEFAULT NULL COMMENT '商品价格',
  `product_image` varchar(255) DEFAULT NULL COMMENT '商品图片',
  `status` varchar(20) NOT NULL COMMENT '状态：waiting,joined,expired,cancelled,completed',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `expire_time` datetime NOT NULL COMMENT '过期时间',
  `complete_time` datetime DEFAULT NULL COMMENT '完成时间',
  `order_id` varchar(64) DEFAULT NULL COMMENT '关联订单ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_invite_code` (`invite_code`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_participant_id` (`participant_id`),
  KEY `idx_status` (`status`),
  KEY `idx_expire_time` (`expire_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='一起喝邀请表';

-- 添加说明
COMMENT ON TABLE `together_drink_invitation` IS '一起喝邀请表';
COMMENT ON COLUMN `together_drink_invitation`.`id` IS '邀请ID';
COMMENT ON COLUMN `together_drink_invitation`.`invite_code` IS '邀请码';
COMMENT ON COLUMN `together_drink_invitation`.`creator_id` IS '创建者ID';
COMMENT ON COLUMN `together_drink_invitation`.`creator_nickname` IS '创建者昵称';
COMMENT ON COLUMN `together_drink_invitation`.`creator_avatar` IS '创建者头像';
COMMENT ON COLUMN `together_drink_invitation`.`participant_id` IS '参与者ID';
COMMENT ON COLUMN `together_drink_invitation`.`participant_nickname` IS '参与者昵称';
COMMENT ON COLUMN `together_drink_invitation`.`participant_avatar` IS '参与者头像';
COMMENT ON COLUMN `together_drink_invitation`.`product_id` IS '商品ID';
COMMENT ON COLUMN `together_drink_invitation`.`product_name` IS '商品名称';
COMMENT ON COLUMN `together_drink_invitation`.`product_price` IS '商品价格';
COMMENT ON COLUMN `together_drink_invitation`.`product_image` IS '商品图片';
COMMENT ON COLUMN `together_drink_invitation`.`status` IS '状态：waiting,joined,expired,cancelled,completed';
COMMENT ON COLUMN `together_drink_invitation`.`create_time` IS '创建时间';
COMMENT ON COLUMN `together_drink_invitation`.`expire_time` IS '过期时间';
COMMENT ON COLUMN `together_drink_invitation`.`complete_time` IS '完成时间';
COMMENT ON COLUMN `together_drink_invitation`.`order_id` IS '关联订单ID'; 