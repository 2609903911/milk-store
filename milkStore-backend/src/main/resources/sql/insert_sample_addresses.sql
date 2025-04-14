-- 插入示例地址数据
-- 注意: 需要先确保users表中存在对应的user_id

-- 假设users表中存在一个用户ID为'user_12345'的记录
-- 如果user_id不存在，请先在users表中插入对应的用户数据或者修改以下SQL中的user_id为实际存在的值

-- 北京地址
INSERT INTO `user_address` 
(`user_id`, `contact_name`, `gender`, `phone`, `address`, `is_default`) 
VALUES 
('user_12345', '张三', 'male', '13812345678', '北京市海淀区中关村南大街5号', 1);

-- 上海地址
INSERT INTO `user_address` 
(`user_id`, `contact_name`, `gender`, `phone`, `address`, `is_default`) 
VALUES 
('user_12345', '李四', 'male', '13912345678', '上海市浦东新区陆家嘴环路1000号', 0);

-- 广州地址
INSERT INTO `user_address` 
(`user_id`, `contact_name`, `gender`, `phone`, `address`, `is_default`) 
VALUES 
('user_12345', '王五', 'male', '15012345678', '广州市天河区珠江新城冼村路28号', 0);

-- 深圳地址
INSERT INTO `user_address` 
(`user_id`, `contact_name`, `gender`, `phone`, `address`, `is_default`) 
VALUES 
('user_12345', '赵六', 'male', '18612345678', '深圳市南山区科技园科发路8号', 0);

-- 成都地址
INSERT INTO `user_address` 
(`user_id`, `contact_name`, `gender`, `phone`, `address`, `is_default`) 
VALUES 
('user_12345', '小红', 'female', '13712345678', '成都市武侯区人民南路四段12号', 0);

-- 重庆地址
INSERT INTO `user_address` 
(`user_id`, `contact_name`, `gender`, `phone`, `address`, `is_default`) 
VALUES 
('user_12345', '小明', 'male', '13612345678', '重庆市渝北区龙溪街道新南路18号', 0);

-- 杭州地址
INSERT INTO `user_address` 
(`user_id`, `contact_name`, `gender`, `phone`, `address`, `is_default`) 
VALUES 
('user_12345', '小芳', 'female', '17612345678', '杭州市西湖区西溪路556号', 0);

-- 南京地址
INSERT INTO `user_address` 
(`user_id`, `contact_name`, `gender`, `phone`, `address`, `is_default`) 
VALUES 
('user_12345', '小刚', 'male', '18812345678', '南京市鼓楼区中山北路30号', 0); 