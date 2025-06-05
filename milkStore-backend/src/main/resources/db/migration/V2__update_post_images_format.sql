-- 更新已存在的帖子图片数据，将//分隔符改为||分隔符
UPDATE posts
SET images = REPLACE(images, '//', '||')
WHERE images LIKE '%//%';

-- 对于可能存在的逗号分隔的数据，也进行转换
UPDATE posts
SET images = REPLACE(images, ',', '||')
WHERE images LIKE '%,%' AND images NOT LIKE '%//%'; 