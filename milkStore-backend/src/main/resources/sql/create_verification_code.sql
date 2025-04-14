-- 创建验证码表
CREATE TABLE `verification_code` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) COLLATE utf8mb4_general_ci NOT NULL COMMENT '手机号',
  `code` varchar(6) COLLATE utf8mb4_general_ci NOT NULL COMMENT '6位验证码',
  `type` varchar(20) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'login' COMMENT '验证码类型(login-登录, register-注册, resetPassword-重置密码)',
  `expire_time` datetime NOT NULL COMMENT '过期时间',
  `is_used` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否已使用',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_phone_type` (`phone`, `type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='验证码表'; 