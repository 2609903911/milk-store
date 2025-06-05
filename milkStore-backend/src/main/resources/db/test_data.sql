-- 帖子测试数据
INSERT INTO posts (post_id, user_id, product_id, title, content, images, likes_count, comments_count, create_time, update_time, status) VALUES
('post_1001', 'user_10001', 1, '这款奶茶太好喝了！', '今天尝试了这款奶茶，口感非常顺滑，茶香浓郁，奶味十足，强烈推荐给大家！', 
'/static/images/posts/post1_1.jpg||/static/images/posts/post1_2.jpg', 
15, 5, '2023-05-15 10:30:00', '2023-05-15 10:30:00', 1),

('post_1002', 'user_10002', 3, '夏日必备冰奶茶', '炎炎夏日，这款冰奶茶简直是救星，清爽不腻，冰块刚刚好，甜度适中，每天都想喝！', 
'/static/images/posts/post2_1.jpg', 
23, 8, '2023-05-16 14:20:00', '2023-05-16 14:20:00', 1),

('post_1003', 'user_10003', 5, '珍珠奶茶新体验', '这家店的珍珠奶茶与众不同，珍珠很有嚼劲，茶底选用的是高级茶叶，值得一试！', 
'/static/images/posts/post3_1.jpg||/static/images/posts/post3_2.jpg||/static/images/posts/post3_3.jpg', 
42, 12, '2023-05-17 16:45:00', '2023-05-17 16:45:00', 1),

('post_1004', 'user_10004', 7, '水果茶的极致享受', '这款水果茶里的水果都很新鲜，搭配特制茶底，酸甜可口，非常适合下午茶时光！', 
'/static/images/posts/post4_1.jpg', 
31, 9, '2023-05-18 11:10:00', '2023-05-18 11:10:00', 1),

('post_1005', 'user_10005', 9, '抹茶控必喝', '作为一个抹茶控，这款抹茶奶茶简直是天堂，抹茶味浓郁，不会太甜，完美平衡！', 
'/static/images/posts/post5_1.jpg||/static/images/posts/post5_2.jpg', 
56, 15, '2023-05-19 09:30:00', '2023-05-19 09:30:00', 1);

-- 帖子点赞测试数据
INSERT INTO likes (like_id, user_id, target_id, target_type, create_time) VALUES
('like_1001', 'user_10002', 'post_1001', 1, '2023-05-15 11:35:00'),
('like_1002', 'user_10003', 'post_1001', 1, '2023-05-15 12:40:00'),
('like_1003', 'user_10004', 'post_1002', 1, '2023-05-16 15:25:00'),
('like_1004', 'user_10005', 'post_1002', 1, '2023-05-16 16:15:00'),
('like_1005', 'user_10001', 'post_1003', 1, '2023-05-17 17:35:00');

-- 帖子评论测试数据
INSERT INTO comments (comment_id, post_id, user_id, content, parent_id, reply_to_user_id, likes_count, create_time, status) VALUES
('comment_1001', 'post_1001', 'user_10002', '完全同意！这款奶茶确实很棒，我也很喜欢！', NULL, NULL, 5, '2023-05-15 11:30:00', 1),
('comment_1002', 'post_1001', 'user_10003', '请问加了什么配料吗？看起来很诱人！', NULL, NULL, 3, '2023-05-15 12:45:00', 1),
('comment_1003', 'post_1002', 'user_10004', '确实是夏天的绝配，我每天也会喝一杯解暑！', NULL, NULL, 7, '2023-05-16 15:20:00', 1),
('comment_1004', 'post_1003', 'user_10005', '珍珠确实很Q弹，但我觉得茶味可以再浓一些。', NULL, NULL, 4, '2023-05-17 17:30:00', 1),
('comment_1005', 'post_1003', 'user_10001', '我也非常喜欢这款奶茶，已经买了好几次了！', NULL, NULL, 2, '2023-05-17 18:15:00', 1);

-- 评论回复测试数据
INSERT INTO comments (comment_id, post_id, user_id, content, parent_id, reply_to_user_id, likes_count, create_time, status) VALUES
('comment_1006', 'post_1001', 'user_10001', '谢谢支持！这是我的最爱！', 'comment_1001', 'user_10002', 2, '2023-05-15 13:00:00', 1),
('comment_1007', 'post_1001', 'user_10001', '加了珍珠和椰果，很推荐哦！', 'comment_1002', 'user_10003', 1, '2023-05-15 14:10:00', 1),
('comment_1008', 'post_1002', 'user_10002', '是的，特别是运动后喝更爽！', 'comment_1003', 'user_10004', 3, '2023-05-16 17:00:00', 1),
('comment_1009', 'post_1003', 'user_10003', '下次我会要求加浓茶，谢谢建议！', 'comment_1004', 'user_10005', 2, '2023-05-17 19:00:00', 1),
('comment_1010', 'post_1003', 'user_10003', '欢迎继续支持，后续还会有更多新品推出哦！', 'comment_1005', 'user_10001', 1, '2023-05-17 19:30:00', 1);

-- 评论点赞测试数据
INSERT INTO likes (like_id, user_id, target_id, target_type, create_time) VALUES
('like_1006', 'user_10001', 'comment_1001', 2, '2023-05-15 13:05:00'),
('like_1007', 'user_10003', 'comment_1001', 2, '2023-05-15 14:00:00'),
('like_1008', 'user_10002', 'comment_1003', 2, '2023-05-16 16:00:00'),
('like_1009', 'user_10004', 'comment_1003', 2, '2023-05-16 17:30:00'),
('like_1010', 'user_10005', 'comment_1003', 2, '2023-05-16 18:45:00'); 