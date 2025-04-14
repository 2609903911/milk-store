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

## 城市接口

### 获取所有城市数据

获取所有城市数据，包括热门城市和按字母分组的城市信息。

- **URL**: `/api/cities`
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
  "message": "获取城市数据成功",
  "data": {
    "hotCities": [
      {
        "id": 1,
        "name": "北京",
        "pinyin": "beijing",
        "code": "110000",
        "latitude": 39.9042,
        "longitude": 116.4074,
        "isHot": true,
        "createdAt": "2023-04-01 12:00:00",
        "updatedAt": "2023-04-01 12:00:00"
      },
      // 更多热门城市...
    ],
    "letters": ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"],
    "cityMap": {
      "A": [
        {
          "id": 13,
          "name": "安庆",
          "pinyin": "anqing",
          "code": "340800",
          "latitude": 30.5434,
          "longitude": 117.0425,
          "isHot": false,
          "createdAt": "2023-04-01 12:00:00",
          "updatedAt": "2023-04-01 12:00:00"
        },
        // 更多A开头的城市...
      ],
      "B": [
        // B开头的城市...
      ],
      // 更多字母分组...
    }
  }
}
```

#### 响应字段说明

| 字段 | 类型 | 描述 |
|------|------|------|
| code | Integer | 状态码，200表示成功 |
| message | String | 响应消息 |
| data | Object | 城市数据对象 |
| data.hotCities | Array | 热门城市数组 |
| data.letters | Array | 字母索引数组 |
| data.cityMap | Object | 按字母分组的城市映射 |
| data.cityMap.X | Array | X字母开头的城市数组 |
| city.id | Integer | 城市ID |
| city.name | String | 城市名称 |
| city.pinyin | String | 城市拼音 |
| city.code | String | 城市编码 |
| city.latitude | Double | 纬度 |
| city.longitude | Double | 经度 |
| city.isHot | Boolean | 是否热门城市 |
| city.createdAt | String | 创建时间 |
| city.updatedAt | String | 更新时间 |

### 获取热门城市

获取所有标记为热门的城市信息。

- **URL**: `/api/cities/hot`
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
  "message": "获取热门城市成功",
  "data": [
    {
      "id": 1,
      "name": "北京",
      "pinyin": "beijing",
      "code": "110000",
      "latitude": 39.9042,
      "longitude": 116.4074,
      "isHot": true,
      "createdAt": "2023-04-01 12:00:00",
      "updatedAt": "2023-04-01 12:00:00"
    },
    // 更多热门城市...
  ]
}
```

### 获取特定字母开头的城市

获取指定字母开头的城市列表。

- **URL**: `/api/cities/letter/{letter}`
- **方法**: `GET`
- **需要认证**: 否
- **参数**: 
  - `letter`: 路径参数，城市拼音首字母（A-Z）

#### 成功响应

- **状态码**: 200 OK
- **内容类型**: application/json
- **响应体**:

```json
{
  "code": 200,
  "message": "获取B开头的城市成功",
  "data": [
    {
      "id": 1,
      "name": "北京",
      "pinyin": "beijing",
      "code": "110000",
      "latitude": 39.9042,
      "longitude": 116.4074,
      "isHot": true,
      "createdAt": "2023-04-01 12:00:00",
      "updatedAt": "2023-04-01 12:00:00"
    },
    // 更多B开头的城市...
  ]
}
```

## 产品接口

### 获取所有产品

获取所有激活状态的产品信息。

- **URL**: `/api/milk-products`
- **方法**: `GET`
- **需要认证**: 否
- **参数**: 无

#### 成功响应

- **状态码**: 200 OK
- **内容类型**: application/json
- **响应体**:

```json
[
  {
    "id": 1,
    "name": "超级霸气水果茶",
    "description": "采用新鲜水果，口感清爽，果香浓郁",
    "price": 18.00,
    "imageUrl": "/static/images/products/fruit-tea-1.jpg",
    "category": {
      "id": 1,
      "name": "水果茶",
      "description": "新鲜水果融合优质茶底"
    },
    "createdAt": "2023-04-01 12:00:00",
    "updatedAt": "2023-04-01 12:00:00"
  },
  {
    "id": 2,
    "name": "芝芝芒芒",
    "description": "优质茶底融合新鲜芒果果肉和芝士奶盖",
    "price": 22.00,
    "imageUrl": "/static/images/products/fruit-tea-2.jpg",
    "category": {
      "id": 1,
      "name": "水果茶",
      "description": "新鲜水果融合优质茶底"
    },
    "createdAt": "2023-04-01 12:00:00",
    "updatedAt": "2023-04-01 12:00:00"
  }
  // 更多产品...
]
```

#### 响应字段说明

| 字段 | 类型 | 描述 |
|------|------|------|
| id | Integer | 产品ID |
| name | String | 产品名称 |
| description | String | 产品描述 |
| price | Decimal | 产品价格 |
| imageUrl | String | 产品图片URL |
| category | Object | 产品所属分类 |
| category.id | Integer | 分类ID |
| category.name | String | 分类名称 |
| category.description | String | 分类描述 |
| createdAt | String | 创建时间 |
| updatedAt | String | 更新时间 |

### 获取所有产品（包括非活跃产品）

获取所有产品信息，包括非活跃状态的产品。

- **URL**: `/api/milk-products/all`
- **方法**: `GET`
- **需要认证**: 是（管理员权限）
- **参数**: 无

#### 成功响应

- **状态码**: 200 OK
- **内容类型**: application/json
- **响应体**: 同上，但包含所有产品

### 根据ID获取产品

根据指定的ID获取产品详细信息。

- **URL**: `/api/milk-products/{id}`
- **方法**: `GET`
- **需要认证**: 否
- **参数**: 
  - `id`: 路径参数，产品ID

#### 成功响应

- **状态码**: 200 OK
- **内容类型**: application/json
- **响应体**:

```json
{
  "id": 1,
  "name": "超级霸气水果茶",
  "description": "采用新鲜水果，口感清爽，果香浓郁",
  "price": 18.00,
  "imageUrl": "/static/images/products/fruit-tea-1.jpg",
  "category": {
    "id": 1,
    "name": "水果茶",
    "description": "新鲜水果融合优质茶底"
  },
  "createdAt": "2023-04-01 12:00:00",
  "updatedAt": "2023-04-01 12:00:00"
}
```

#### 错误响应

- **状态码**: 404 Not Found
- **内容类型**: application/json
- **响应体**:

```json
{
  "timestamp": "2023-04-13T06:19:55.972+00:00",
  "status": 404,
  "error": "Not Found",
  "message": "产品不存在",
  "path": "/api/milk-products/999"
}
```

### 根据分类获取产品

获取指定分类下的所有产品。

- **URL**: `/api/milk-products/category/{categoryId}`
- **方法**: `GET`
- **需要认证**: 否
- **参数**: 
  - `categoryId`: 路径参数，分类ID

#### 成功响应

- **状态码**: 200 OK
- **内容类型**: application/json
- **响应体**:

```json
[
  {
    "id": 1,
    "name": "超级霸气水果茶",
    "description": "采用新鲜水果，口感清爽，果香浓郁",
    "price": 18.00,
    "imageUrl": "/static/images/products/fruit-tea-1.jpg",
    "category": {
      "id": 1,
      "name": "水果茶",
      "description": "新鲜水果融合优质茶底"
    },
    "createdAt": "2023-04-01 12:00:00",
    "updatedAt": "2023-04-01 12:00:00"
  },
  {
    "id": 2,
    "name": "芝芝芒芒",
    "description": "优质茶底融合新鲜芒果果肉和芝士奶盖",
    "price": 22.00,
    "imageUrl": "/static/images/products/fruit-tea-2.jpg",
    "category": {
      "id": 1,
      "name": "水果茶",
      "description": "新鲜水果融合优质茶底"
    },
    "createdAt": "2023-04-01 12:00:00",
    "updatedAt": "2023-04-01 12:00:00"
  }
  // 更多产品...
]
```

### 根据名称搜索产品

根据产品名称关键词搜索产品。

- **URL**: `/api/milk-products/search`
- **方法**: `GET`
- **需要认证**: 否
- **参数**: 
  - `name`: 查询参数，产品名称关键词

#### 成功响应

- **状态码**: 200 OK
- **内容类型**: application/json
- **响应体**:

```json
[
  {
    "id": 1,
    "name": "超级霸气水果茶",
    "description": "采用新鲜水果，口感清爽，果香浓郁",
    "price": 18.00,
    "imageUrl": "/static/images/products/fruit-tea-1.jpg",
    "category": {
      "id": 1,
      "name": "水果茶",
      "description": "新鲜水果融合优质茶底"
    },
    "createdAt": "2023-04-01 12:00:00",
    "updatedAt": "2023-04-01 12:00:00"
  },
  // 更多匹配的产品...
]
```

## 产品分类接口

### 获取所有产品分类

获取所有产品分类信息。

- **URL**: `/api/categories`
- **方法**: `GET`
- **需要认证**: 否
- **参数**: 无

#### 成功响应

- **状态码**: 200 OK
- **内容类型**: application/json
- **响应体**:

```json
[
  {
    "id": 1,
    "name": "水果茶",
    "description": "新鲜水果融合优质茶底"
  },
  {
    "id": 2,
    "name": "奶茶",
    "description": "香浓奶茶，口感丝滑"
  },
  {
    "id": 3,
    "name": "咖啡",
    "description": "精选咖啡豆，香气浓郁"
  }
  // 更多分类...
]
```

#### 响应字段说明

| 字段 | 类型 | 描述 |
|------|------|------|
| id | Integer | 分类ID |
| name | String | 分类名称 |
| description | String | 分类描述 |

### 根据ID获取产品分类

根据指定的ID获取产品分类详细信息。

- **URL**: `/api/categories/{id}`
- **方法**: `GET`
- **需要认证**: 否
- **参数**: 
  - `id`: 路径参数，分类ID

#### 成功响应

- **状态码**: 200 OK
- **内容类型**: application/json
- **响应体**:

```json
{
  "id": 1,
  "name": "水果茶",
  "description": "新鲜水果融合优质茶底",
  "products": [
    {
      "id": 1,
      "name": "超级霸气水果茶",
      "description": "采用新鲜水果，口感清爽，果香浓郁",
      "price": 18.00,
      "imageUrl": "/static/images/products/fruit-tea-1.jpg",
      "createdAt": "2023-04-01 12:00:00",
      "updatedAt": "2023-04-01 12:00:00"
    },
    {
      "id": 2,
      "name": "芝芝芒芒",
      "description": "优质茶底融合新鲜芒果果肉和芝士奶盖",
      "price": 22.00,
      "imageUrl": "/static/images/products/fruit-tea-2.jpg",
      "createdAt": "2023-04-01 12:00:00",
      "updatedAt": "2023-04-01 12:00:00"
    }
    // 更多产品...
  ]
}
```

#### 错误响应

- **状态码**: 404 Not Found
- **内容类型**: application/json
- **响应体**:

```json
{
  "timestamp": "2023-04-13T06:19:55.972+00:00",
  "status": 404,
  "error": "Not Found",
  "message": "分类不存在",
  "path": "/api/categories/999"
}
```

## 勋章接口

### 获取所有勋章类型

获取系统中所有可用的勋章类型。

- **URL**: `/api/medals/types`
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
  "message": "获取勋章类型成功",
  "data": [
    {
      "typeId": "seasonal",
      "typeName": "二十四节气限定",
      "description": "与二十四节气相关的限定勋章，每个节气期间可获得",
      "displayOrder": 1,
      "createTime": "2023-05-01 12:00:00",
      "updateTime": "2023-05-01 12:00:00"
    },
    {
      "typeId": "nature",
      "typeName": "大自然限定微章",
      "description": "以大自然元素为主题的限定勋章",
      "displayOrder": 2,
      "createTime": "2023-05-01 12:00:00",
      "updateTime": "2023-05-01 12:00:00"
    },
    {
      "typeId": "starrail",
      "typeName": "崩铁联动限定",
      "description": "与《崩坏：星穹铁道》游戏联动的限定勋章",
      "displayOrder": 3,
      "createTime": "2023-05-01 12:00:00",
      "updateTime": "2023-05-01 12:00:00"
    },
    {
      "typeId": "rank",
      "typeName": "等级徽章",
      "description": "用户达到特定等级后获得的勋章",
      "displayOrder": 4,
      "createTime": "2023-05-01 12:00:00",
      "updateTime": "2023-05-01 12:00:00"
    }
  ]
}
```

#### 响应字段说明

| 字段 | 类型 | 描述 |
|------|------|------|
| code | Integer | 状态码，200表示成功 |
| message | String | 响应消息 |
| data | Array | 勋章类型数组 |
| data[].typeId | String | 类型ID |
| data[].typeName | String | 类型名称 |
| data[].description | String | 类型描述 |
| data[].displayOrder | Integer | 显示顺序 |
| data[].createTime | String | 创建时间 |
| data[].updateTime | String | 更新时间 |

### 获取所有勋章

获取系统中所有可用的勋章信息。

- **URL**: `/api/medals`
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
  "message": "获取所有勋章成功",
  "data": [
    {
      "medalId": "season_01",
      "type": {
        "typeId": "seasonal",
        "typeName": "二十四节气限定"
      },
      "medalName": "节气 · 立春",
      "iconPath": "/static/images/medal/season01.png",
      "description": "立春节气勋章",
      "obtainCondition": "在立春期间购买特定饮品",
      "sortOrder": 1,
      "createTime": "2023-05-01 12:00:00"
    },
    {
      "medalId": "season_02",
      "type": {
        "typeId": "seasonal",
        "typeName": "二十四节气限定"
      },
      "medalName": "节气 · 雨水",
      "iconPath": "/static/images/medal/season02.png",
      "description": "雨水节气勋章",
      "obtainCondition": "在雨水期间购买特定饮品",
      "sortOrder": 2,
      "createTime": "2023-05-01 12:00:00"
    },
    // 更多勋章...
  ]
}
```

#### 响应字段说明

| 字段 | 类型 | 描述 |
|------|------|------|
| code | Integer | 状态码，200表示成功 |
| message | String | 响应消息 |
| data | Array | 勋章数组 |
| data[].medalId | String | 勋章ID |
| data[].type | Object | 勋章所属类型 |
| data[].type.typeId | String | 类型ID |
| data[].type.typeName | String | 类型名称 |
| data[].medalName | String | 勋章名称 |
| data[].iconPath | String | 勋章图标路径 |
| data[].description | String | 勋章描述 |
| data[].obtainCondition | String | 获取条件 |
| data[].sortOrder | Integer | 排序顺序 |
| data[].createTime | String | 创建时间 |

### 根据类型获取勋章

获取特定类型的所有勋章。

- **URL**: `/api/medals/type/{typeId}`
- **方法**: `GET`
- **需要认证**: 否
- **参数**: 
  - `typeId`: 路径参数，勋章类型ID

#### 成功响应

- **状态码**: 200 OK
- **内容类型**: application/json
- **响应体**:

```json
{
  "code": 200,
  "message": "获取类型勋章成功",
  "data": [
    {
      "medalId": "season_01",
      "type": {
        "typeId": "seasonal",
        "typeName": "二十四节气限定"
      },
      "medalName": "节气 · 立春",
      "iconPath": "/static/images/medal/season01.png",
      "description": "立春节气勋章",
      "obtainCondition": "在立春期间购买特定饮品",
      "sortOrder": 1,
      "createTime": "2023-05-01 12:00:00"
    },
    // 更多该类型的勋章...
  ]
}
```

#### 错误响应

- **状态码**: 404 Not Found
- **内容类型**: application/json
- **响应体**:

```json
{
  "code": 404,
  "message": "找不到指定的勋章类型",
  "data": null
}
```

### 获取用户拥有的勋章

获取特定用户拥有的所有勋章。

- **URL**: `/api/medals/user/{userId}`
- **方法**: `GET`
- **需要认证**: 是
- **参数**: 
  - `userId`: 路径参数，用户ID

#### 成功响应

- **状态码**: 200 OK
- **内容类型**: application/json
- **响应体**:

```json
{
  "code": 200,
  "message": "获取用户勋章成功",
  "data": {
    "totalCount": 5,
    "activeCount": 3,
    "medals": [
      {
        "id": 1,
        "medal": {
          "medalId": "season_01",
          "medalName": "节气 · 立春",
          "iconPath": "/static/images/medal/season01.png",
          "type": {
            "typeId": "seasonal",
            "typeName": "二十四节气限定"
          }
        },
        "isActive": true,
        "obtainTime": "2023-05-10 14:23:45"
      },
      {
        "id": 2,
        "medal": {
          "medalId": "nature_bee",
          "medalName": "大自然 · 蜜蜂",
          "iconPath": "/static/images/medal/nature-bee.png",
          "type": {
            "typeId": "nature",
            "typeName": "大自然限定微章"
          }
        },
        "isActive": true,
        "obtainTime": "2023-05-15 09:12:30"
      },
      // 更多用户拥有的勋章...
    ],
    "byType": {
      "seasonal": [
        // 季节勋章...
      ],
      "nature": [
        // 大自然勋章...
      ],
      "starrail": [
        // 崩铁联动勋章...
      ],
      "rank": [
        // 等级勋章...
      ]
    }
  }
}
```

#### 响应字段说明

| 字段 | 类型 | 描述 |
|------|------|------|
| code | Integer | 状态码，200表示成功 |
| message | String | 响应消息 |
| data | Object | 用户勋章数据 |
| data.totalCount | Integer | 用户拥有的勋章总数 |
| data.activeCount | Integer | 用户已激活的勋章数量 |
| data.medals | Array | 用户拥有的勋章列表 |
| data.medals[].id | Integer | 用户勋章关联ID |
| data.medals[].medal | Object | 勋章详细信息 |
| data.medals[].isActive | Boolean | 勋章是否激活 |
| data.medals[].obtainTime | String | 获得勋章的时间 |
| data.byType | Object | 按类型分组的用户勋章 |

#### 错误响应

- **状态码**: 404 Not Found
- **内容类型**: application/json
- **响应体**:

```json
{
  "code": 404,
  "message": "用户不存在",
  "data": null
}
```

- **状态码**: 401 Unauthorized
- **内容类型**: application/json
- **响应体**:

```json
{
  "code": 401,
  "message": "未授权访问",
  "data": null
}
```

## 其他接口文档
// 更多接口文档...

## 用户优惠券接口

### 获取用户优惠券

根据用户ID获取该用户拥有的所有优惠券。

- **URL**: `/api/user-coupons/user/{userId}`
- **方法**: `GET`
- **需要认证**: 是
- **参数**: 
  - `userId`: 路径参数，用户ID

#### 成功响应

- **状态码**: 200 OK
- **内容类型**: application/json
- **响应体**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "id": 1,
      "couponTemplateId": 101,
      "couponCode": "ABC123456",
      "status": "valid",
      "claimTime": "2023-05-01 10:00:00",
      "usedTime": null,
      "orderId": null,
      "createTime": "2023-05-01 10:00:00",
      "updateTime": "2023-05-01 10:00:00",
      "userId": "user123",
      "couponTemplate": {
        "id": 101,
        "name": "新用户立减券",
        "type": "cash",
        "discount": null,
        "amount": 10.00,
        "minOrderAmount": 20.00,
        "description": "新用户首单满20减10",
        "startTime": "2023-05-01 00:00:00",
        "endTime": "2023-06-01 23:59:59"
      }
    },
    {
      "id": 2,
      "couponTemplateId": 102,
      "couponCode": "DEF789012",
      "status": "valid",
      "claimTime": "2023-05-02 15:30:00",
      "usedTime": null,
      "orderId": null,
      "createTime": "2023-05-02 15:30:00",
      "updateTime": "2023-05-02 15:30:00",
      "userId": "user123",
      "couponTemplate": {
        "id": 102,
        "name": "季节限定8折券",
        "type": "discount",
        "discount": 0.8,
        "amount": null,
        "minOrderAmount": 30.00,
        "description": "季节限定产品8折优惠",
        "startTime": "2023-05-01 00:00:00",
        "endTime": "2023-05-31 23:59:59"
      }
    }
    // 更多优惠券...
  ]
}
```

#### 响应字段说明

| 字段 | 类型 | 描述 |
|------|------|------|
| code | Integer | 状态码，200表示成功 |
| message | String | 响应消息 |
| data | Array | 用户优惠券数组 |
| data[].id | Long | 用户优惠券ID |
| data[].couponTemplateId | Long | 优惠券模板ID |
| data[].couponCode | String | 优惠券唯一码 |
| data[].status | String | 优惠券状态(valid-有效,used-已使用,expired-已过期) |
| data[].claimTime | String | 优惠券领取时间 |
| data[].usedTime | String | 优惠券使用时间 |
| data[].orderId | String | 使用的订单ID |
| data[].createTime | String | 创建时间 |
| data[].updateTime | String | 更新时间 |
| data[].userId | String | 用户ID |
| data[].couponTemplate | Object | 优惠券模板信息 |
| data[].couponTemplate.id | Long | 模板ID |
| data[].couponTemplate.name | String | 优惠券名称 |
| data[].couponTemplate.type | String | 优惠券类型(cash-现金券,discount-折扣券,free-免单券) |
| data[].couponTemplate.discount | Double | 折扣率(折扣券专用) |
| data[].couponTemplate.amount | Double | 优惠金额(现金券专用) |
| data[].couponTemplate.minOrderAmount | Double | 最低使用金额 |
| data[].couponTemplate.description | String | 优惠券描述 |
| data[].couponTemplate.startTime | String | 有效期开始时间 |
| data[].couponTemplate.endTime | String | 有效期结束时间 |

#### 错误响应

- **状态码**: 404 Not Found
- **内容类型**: application/json
- **响应体**:

```json
{
  "code": 404,
  "message": "用户不存在",
  "data": null
}
```

- **状态码**: 401 Unauthorized
- **内容类型**: application/json
- **响应体**:

```json
{
  "code": 401,
  "message": "未授权访问",
  "data": null
}
```

### 获取指定状态的用户优惠券

根据用户ID和优惠券状态获取该用户拥有的特定状态的优惠券。

- **URL**: `/api/user-coupons/user/{userId}/status/{status}`
- **方法**: `GET`
- **需要认证**: 是
- **参数**: 
  - `userId`: 路径参数，用户ID
  - `status`: 路径参数，优惠券状态(valid-有效,used-已使用,expired-已过期)

#### 成功响应

- **状态码**: 200 OK
- **内容类型**: application/json
- **响应体**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "id": 1,
      "couponTemplateId": 101,
      "couponCode": "ABC123456",
      "status": "valid",
      "claimTime": "2023-05-01 10:00:00",
      "usedTime": null,
      "orderId": null,
      "createTime": "2023-05-01 10:00:00",
      "updateTime": "2023-05-01 10:00:00",
      "userId": "user123",
      "couponTemplate": {
        "id": 101,
        "name": "新用户立减券",
        "type": "cash",
        "discount": null,
        "amount": 10.00,
        "minOrderAmount": 20.00,
        "description": "新用户首单满20减10",
        "startTime": "2023-05-01 00:00:00",
        "endTime": "2023-06-01 23:59:59"
      }
    },
    // 更多相同状态的优惠券...
  ]
}
```

#### 响应字段说明

与获取用户优惠券接口相同。

#### 错误响应

- **状态码**: 404 Not Found
- **内容类型**: application/json
- **响应体**:

```json
{
  "code": 404,
  "message": "用户不存在或没有指定状态的优惠券",
  "data": null
}
```

- **状态码**: 400 Bad Request
- **内容类型**: application/json
- **响应体**:

```json
{
  "code": 400,
  "message": "无效的优惠券状态",
  "data": null
}
```

- **状态码**: 401 Unauthorized
- **内容类型**: application/json
- **响应体**:

```json
{
  "code": 401,
  "message": "未授权访问",
  "data": null
}
```
