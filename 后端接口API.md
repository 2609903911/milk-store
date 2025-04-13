# 奶茶店后端API接口文档

## 首页轮播图产品接口

### 获取所有轮播图产品

获取所有用于首页展示的轮播图产品信息。

- **URL**: `/api/banners`
- **方法**: `GET`
- **需要认证**: 否
- **参数**: 无

#### 成功响应

- **状态码**: 200 OK
- **内容类型**: application/json
- **响应体**:

```json
{
  "code": 200,
  "message": "获取轮播图产品成功",
  "data": [
    {
      "id": 1,
      "tag": "超级蔬食 轻畅系列焕新",
      "title1": "早畅晚轻",
      "title2": "24h轻畅循环",
      "desc1": "鲜果每日鲜榨",
      "desc2": "一杯轻启肠道SPA",
      "imageUrl": "/static/images/scroll01.png",
      "bgColor": "#8a9a5b",
      "createdAt": "2023-04-01 12:00:00",
      "updatedAt": "2023-04-01 12:00:00"
    },
    {
      "id": 2,
      "tag": "桑葚系列",
      "title1": "三重花青素",
      "title2": "自然好气色",
      "desc1": "爆款回归 一年卖出一千万杯！",
      "desc2": "三重莓果 唤醒春日好气色",
      "imageUrl": "/static/images/scroll02.jpg",
      "bgColor": "#e6f7ff",
      "createdAt": "2023-04-01 12:00:00",
      "updatedAt": "2023-04-01 12:00:00"
    }
    // 更多产品...
  ]
}
```

#### 响应字段说明

| 字段 | 类型 | 描述 |
|------|------|------|
| code | Integer | 状态码，200表示成功 |
| message | String | 响应消息 |
| data | Array | 轮播图产品数组 |
| data[].id | Integer | 产品ID |
| data[].tag | String | 产品标签 |
| data[].title1 | String | 标题第一行 |
| data[].title2 | String | 标题第二行 |
| data[].desc1 | String | 描述第一行 |
| data[].desc2 | String | 描述第二行 |
| data[].imageUrl | String | 产品图片URL |
| data[].bgColor | String | 背景颜色（十六进制颜色代码） |
| data[].createdAt | String | 创建时间 |
| data[].updatedAt | String | 更新时间 |

#### 错误响应

- **状态码**: 500 Internal Server Error
- **内容类型**: application/json
- **响应体**:

```json
{
  "code": 500,
  "message": "服务器内部错误",
  "data": null
}
```

## 其他接口文档
// 更多接口文档...
