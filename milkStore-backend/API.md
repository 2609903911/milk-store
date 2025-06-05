以下是基于用户发帖、评论、点赞和关注功能可能会用到的 API 列表：

### 帖子相关 API

1. **获取帖子列表**

   - 路径: `/api/posts`
   - 方法: GET
   - 参数:
     - page: 页码
     - size: 每页数量
     - sortBy: 排序方式（最新、最热）
   - 功能: 分页获取帖子列表，可按最新发布或最热（点赞数）排序

2. **获取帖子详情**

   - 路径: `/api/posts/{postId}`
   - 方法: GET
   - 功能: 获取指定帖子的详细信息，包括发帖用户信息、关联商品信息等

3. **发布帖子**

   - 路径: `/api/posts`
   - 方法: POST
   - 参数:
     - title: 帖子标题
     - content: 帖子内容
     - productId: 关联的奶茶商品 ID
     - images: 图片列表
   - 功能: 创建新帖子

4. **更新帖子**

   - 路径: `/api/posts/{postId}`
   - 方法: PUT
   - 参数:
     - title: 帖子标题
     - content: 帖子内容
     - images: 图片列表
   - 功能: 更新已有帖子信息

5. **删除帖子**

   - 路径: `/api/posts/{postId}`
   - 方法: DELETE
   - 功能: 删除指定帖子（可以是物理删除或逻辑删除）

6. **获取用户发布的帖子**

   - 路径: `/api/users/{userId}/posts`
   - 方法: GET
   - 参数:
     - page: 页码
     - size: 每页数量
   - 功能: 获取指定用户发布的所有帖子

### 评论相关 API

1. **获取帖子评论列表**

   - 路径: `/api/posts/{postId}/comments`
   - 方法: GET
   - 参数:
     - page: 页码
     - size: 每页数量
   - 功能: 获取指定帖子下的评论列表

2. **发表评论**

   - 路径: `/api/comments`
   - 方法: POST
   - 参数:
     - postId: 帖子 ID
     - content: 评论内容
     - parentId: 父评论 ID（回复评论时使用）
     - replyToUserId: 被回复用户 ID（回复评论时使用）
   - 功能: 发表评论或回复评论

3. **删除评论**

   - 路径: `/api/comments/{commentId}`
   - 方法: DELETE
   - 功能: 删除指定评论

### 点赞相关 API

1. **点赞/取消点赞帖子**

   - 路径: `/api/posts/{postId}/like`
   - 方法: POST
   - 功能: 对帖子进行点赞或取消点赞操作

<!-- 2. **点赞/取消点赞评论**

   - 路径: `/api/comments/{commentId}/like`
   - 方法: POST
   - 功能: 对评论进行点赞或取消点赞操作 -->

3. **获取用户点赞的帖子**

   - 路径: `/api/users/{userId}/liked-posts`
   - 方法: GET
   - 参数:
     - page: 页码
     - size: 每页数量
   - 功能: 获取用户点赞过的所有帖子

4. **检查用户是否点赞**
   - 路径: `/api/users/check-like`
   - 方法: GET
   - 参数:
     - targetId: 目标 ID（帖子 ID 或评论 ID）
     - targetType: 目标类型（1-帖子，2-评论）
   - 功能: 检查当前登录用户是否已点赞指定目标

### 文件上传 API

1. **上传图片**

   - 路径: `/api/upload/images`
   - 方法: POST
   - 参数:
     - files: 图片文件（支持多文件上传）
   - 功能: 上传帖子相关的图片

2. **上传帖子图片**

   - 路径: `/api/upload/post/images`
   - 方法: POST
   - 参数:
     - files: 图片文件列表（支持多文件上传）
   - 返回:
     - code: 状态码
     - message: 提示信息
     - data:
       - imageUrls: 图片 URL 列表
       - imagesStr: 以"||"分隔的图片 URL 字符串
   - 功能: 上传帖子相关图片到指定文件夹（E:/uni-app/milkStore/milk-store/uploads/post）

3. **上传帖子图片（字符串版本）**
   - 路径: `/api/upload/post/images/string`
   - 方法: POST
   - 参数:
     - imagesStr: 现有图片 URL 字符串（多个 URL 用"||"分隔，可选）
     - files: 图片文件列表（支持多文件上传）
   - 返回:
     - code: 状态码
     - message: 提示信息
     - data:
       - imagesStr: 合并后的图片 URL 字符串（包含现有图片和新上传图片的 URL，用"||"分隔）
       - imageUrls: 所有图片 URL 列表
       - newImageUrls: 新上传的图片 URL 列表
   - 功能: 将新上传的图片与现有图片 URL 合并，返回统一的图片 URL 字符串

### 用户关注相关 API

1. **关注用户**

   - 路径: `/api/follow/{followedId}`
   - 方法: POST
   - 功能: 关注指定用户

2. **取消关注**

   - 路径: `/api/follow/{followedId}`
   - 方法: DELETE
   - 功能: 取消关注指定用户

3. **检查关注状态**

   - 路径: `/api/follow/check/{followedId}`
   - 方法: GET
   - 功能: 检查当前登录用户是否已关注指定用户

4. **批量检查关注状态**

   - 路径: `/api/follow/check/batch`
   - 方法: POST
   - 参数:
     - 请求体: 被关注用户 ID 列表
   - 功能: 批量检查当前登录用户是否已关注指定用户列表

5. **获取用户关注列表**

   - 路径: `/api/follow/following/{userId}`
   - 方法: GET
   - 参数:
     - page: 页码（默认 1）
     - size: 每页数量（默认 10）
   - 功能: 获取指定用户的关注列表

6. **获取用户粉丝列表**

   - 路径: `/api/follow/followers/{userId}`
   - 方法: GET
   - 参数:
     - page: 页码（默认 1）
     - size: 每页数量（默认 10）
   - 功能: 获取指定用户的粉丝列表

<!-- ### 统计相关 API

1. **获取帖子统计信息**

   - 路径: `/api/posts/{postId}/stats`
   - 方法: GET
   - 功能: 获取帖子的统计信息（点赞数、评论数等）

2. **获取热门帖子**

   - 路径: `/api/posts/hot`
   - 方法: GET
   - 参数:
     - page: 页码
     - size: 每页数量
     - period: 时间段（今日、本周、本月）
   - 功能: 获取指定时间段内的热门帖子

3. **获取推荐帖子**
   - 路径: `/api/posts/recommend`
   - 方法: GET
   - 参数:
     - page: 页码
     - size: 每页数量
   - 功能: 根据用户兴趣获取推荐的帖子 -->

这些 API 覆盖了用户发帖、评论、点赞和关注功能的基本需求。根据实际业务需求，你可能需要对这些 API 进行调整或添加新的 API。每个 API 都应该包含适当的权限验证，确保只有授权用户才能执行相应操作。
