# 奶茶店 API 接口文档

本文档列出奶茶店后端API的所有接口地址和参数。

## 目录

- [认证相关接口](#认证相关接口)
- [用户相关接口](#用户相关接口)
- [优惠券相关接口](#优惠券相关接口)
- [勋章相关接口](#勋章相关接口)
- [产品相关接口](#产品相关接口)
- [分类相关接口](#分类相关接口)
- [轮播图相关接口](#轮播图相关接口)
- [城市相关接口](#城市相关接口)

## 认证相关接口

### 发送验证码

- **URL**: `/api/auth/code/send`
- **方法**: POST
- **参数**:
  - `phone`: 手机号
  - `type`: 验证码类型，默认为 "login"

### 使用验证码登录

- **URL**: `/api/auth/login/code`
- **方法**: POST
- **参数**:
  - `phone`: 手机号
  - `code`: 验证码

## 用户相关接口

### 获取用户详细信息

- **URL**: `/api/user/profile`
- **方法**: GET
- **参数**:
  - `userId`: 用户ID

## 优惠券相关接口

### 根据用户ID查询用户优惠券

- **URL**: `/api/user-coupons/user/{userId}`
- **方法**: GET
- **参数**:
  - `userId`: 用户ID

### 根据用户ID查询用户优惠券（包含模板信息）

- **URL**: `/api/user-coupons/user/{userId}/with-template`
- **方法**: GET
- **参数**:
  - `userId`: 用户ID

### 根据用户ID和状态查询用户优惠券

- **URL**: `/api/user-coupons/user/{userId}/status/{status}`
- **方法**: GET
- **参数**:
  - `userId`: 用户ID
  - `status`: 优惠券状态

### 根据用户ID和状态查询用户优惠券（包含模板信息）

- **URL**: `/api/user-coupons/user/{userId}/status/{status}/with-template`
- **方法**: GET
- **参数**:
  - `userId`: 用户ID
  - `status`: 优惠券状态

### 检查数据库表结构

- **URL**: `/api/user-coupons/check-table-structure`
- **方法**: GET
- **参数**: 无

## 勋章相关接口

### 获取所有勋章类型

- **URL**: `/api/medals/types`
- **方法**: GET
- **参数**: 无

### 获取所有勋章

- **URL**: `/api/medals`
- **方法**: GET
- **参数**: 无

### 根据类型获取勋章

- **URL**: `/api/medals/type/{typeId}`
- **方法**: GET
- **参数**:
  - `typeId`: 勋章类型ID

### 获取用户拥有的勋章

- **URL**: `/api/medals/user/{userId}`
- **方法**: GET
- **参数**:
  - `userId`: 用户ID

## 产品相关接口

### 获取所有产品

- **URL**: `/api/milk-products`
- **方法**: GET
- **参数**: 无

### 获取所有产品（包括非活跃产品）

- **URL**: `/api/milk-products/all`
- **方法**: GET
- **参数**: 无

### 根据ID获取产品

- **URL**: `/api/milk-products/{id}`
- **方法**: GET
- **参数**:
  - `id`: 产品ID

### 根据分类获取产品

- **URL**: `/api/milk-products/category/{categoryId}`
- **方法**: GET
- **参数**:
  - `categoryId`: 分类ID

### 搜索产品

- **URL**: `/api/milk-products/search`
- **方法**: GET
- **参数**:
  - `name`: 产品名称关键词

## 分类相关接口

### 获取所有分类

- **URL**: `/api/categories`
- **方法**: GET
- **参数**: 无

### 根据ID获取分类

- **URL**: `/api/categories/{id}`
- **方法**: GET
- **参数**:
  - `id`: 分类ID

## 轮播图相关接口

### 获取所有轮播图

- **URL**: `/api/banners`
- **方法**: GET
- **参数**: 无

## 城市相关接口

### 获取所有城市数据

- **URL**: `/api/cities`
- **方法**: GET
- **参数**: 无

### 获取热门城市

- **URL**: `/api/cities/hot`
- **方法**: GET
- **参数**: 无

### 根据首字母获取城市

- **URL**: `/api/cities/letter/{letter}`
- **方法**: GET
- **参数**:
  - `letter`: 城市首字母（大写） 

  
## 商城商品相关接口

### 获取所有商城商品

- **URL**: `/api/store/products`
- **方法**: GET
- **参数**: 无

### 根据分类获取商城商品

- **URL**: `/api/store/products/category/{category}`
- **方法**: GET
- **参数**:
  - `category`: 商品分类（discount, cash, free, lightStar, shipping）

### 根据ID获取商城商品

- **URL**: `/api/store/products/{id}`
- **方法**: GET
- **参数**:
  - `id`: 商品ID

### 获取商城首页数据

- **URL**: `/api/store/home`
- **方法**: GET
- **参数**: 无
- **返回**: 所有商品及按分类分组的商品

### 添加商城商品（管理员接口）

- **URL**: `/api/store/admin/products`
- **方法**: POST
- **参数**: 商品对象（JSON格式）
  - `title`: 商品标题
  - `type`: 商品类型
  - `value`: 商品价值
  - `minOrderAmount`: 最低订单金额
  - `description`: 商品描述
  - `validity`: 有效期
  - `coinsCost`: 所需熊猫币
  - `category`: 分类
  - `imageUrl`: 商品图片URL（可选）

### 更新商城商品（管理员接口）

- **URL**: `/api/store/admin/products/{id}`
- **方法**: PUT
- **参数**:
  - `id`: 商品ID
  - 商品对象（JSON格式）

### 删除商城商品（管理员接口）

- **URL**: `/api/store/admin/products/{id}`
- **方法**: DELETE
- **参数**:
  - `id`: 商品ID
