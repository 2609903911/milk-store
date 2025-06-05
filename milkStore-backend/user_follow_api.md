# 用户关注接口 API 文档

## 1. 关注用户

### 请求

```
POST /api/follow/{followedId}?follower_id={followerId}
```

**路径参数**：

- `followedId`：被关注用户的 ID

**查询参数**：

- `follower_id`：关注者的用户 ID

### 响应

**成功响应** (200 OK)：

```json
{
  "code": 200,
  "message": "关注成功",
  "data": true
}
```

**错误响应**：

```json
{
  "code": 400,
  "message": "已经关注该用户",
  "data": null
}
```

或

```json
{
  "code": 404,
  "message": "用户不存在",
  "data": null
}
```

## 2. 取消关注

### 请求

```
DELETE /api/follow/{followedId}?follower_id={followerId}
```

**路径参数**：

- `followedId`：被关注用户的 ID

**查询参数**：

- `follower_id`：关注者的用户 ID

### 响应

**成功响应** (200 OK)：

```json
{
  "code": 200,
  "message": "取消关注成功",
  "data": true
}
```

**错误响应**：

```json
{
  "code": 400,
  "message": "未关注该用户",
  "data": null
}
```

## 3. 检查关注状态

### 请求

```
GET /api/follow/check/{followedId}?follower_id={followerId}
```

**路径参数**：

- `followedId`：被检查的用户 ID

**查询参数**：

- `follower_id`：关注者的用户 ID

### 响应

**成功响应** (200 OK)：

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "isFollowing": true // 已关注为true，未关注为false
  }
}
```

## 4. 批量检查关注状态

### 请求

```
POST /api/follow/check/batch?follower_id={followerId}
```

**查询参数**：

- `follower_id`：关注者的用户 ID

**请求体**：

```json
["用户ID1", "用户ID2", "用户ID3"]
```

### 响应

**成功响应** (200 OK)：

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "followingMap": {
      "用户ID1": true,
      "用户ID2": false,
      "用户ID3": true
    }
  }
}
```

## 5. 获取用户关注列表

### 请求

```
GET /api/follow/following/{userId}?page={page}&size={size}&current_user_id={currentUserId}
```

**路径参数**：

- `userId`：查询的用户 ID

**查询参数**：

- `page`：页码，默认为 1
- `size`：每页数量，默认为 10
- `current_user_id`：当前用户 ID（可选），用于标记列表中是否已关注

### 响应

**成功响应** (200 OK)：

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "total": 25,
    "list": [
      {
        "userId": "用户ID1",
        "username": "用户名1",
        "avatar": "头像URL1",
        "followTime": "2023-10-15 14:30:00",
        "isFollowing": true
      }
      // 更多用户...
    ]
  }
}
```

## 6. 获取用户粉丝列表

### 请求

```
GET /api/follow/followers/{userId}?page={page}&size={size}&current_user_id={currentUserId}
```

**路径参数**：

- `userId`：查询的用户 ID

**查询参数**：

- `page`：页码，默认为 1
- `size`：每页数量，默认为 10
- `current_user_id`：当前用户 ID（可选），用于标记列表中是否已关注

### 响应

**成功响应** (200 OK)：

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "total": 18,
    "list": [
      {
        "userId": "用户ID1",
        "username": "用户名1",
        "avatar": "头像URL1",
        "followTime": "2023-10-15 14:30:00",
        "isFollowing": false
      }
      // 更多用户...
    ]
  }
}
```

## 常见错误及解决方案

### 1. 缺少必要参数

**错误描述**：

```
400 Bad Request
{
  "code": 400,
  "message": "Required parameter 'follower_id' is not present",
  "data": null
}
```

**解决方案**：
确保在请求 URL 中包含了`follower_id`参数，例如：

```
POST /api/follow/10001?follower_id=10002
```

### 2. 用户 ID 格式错误

**错误描述**：
使用了不正确的 ID 格式或不存在的用户 ID。

**解决方案**：
确保使用有效的用户 ID，并检查 ID 格式是否正确。

### 3. 批量查询格式错误

**错误描述**：
请求体格式不正确。

**解决方案**：
确保请求体是一个 JSON 数组格式：

```json
["10001", "10002", "10003"]
```
