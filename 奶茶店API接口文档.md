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
- [地址相关接口](#地址相关接口)
- [商城商品相关接口](#商城商品相关接口)
- [订单相关接口](#订单相关接口)
- [一起喝相关接口](#一起喝相关接口)

## 认证相关接口

### 发送验证码

- **URL**: `/api/auth/code/send`
- **方法**: GET, POST
- **参数**:
  - `phone`: 手机号
  - `type`: 验证码类型，默认为 "login"
- **说明**: 
  - 手机号更新验证码可使用 type="update_phone"
  - 登录验证码可使用 type="login"
  - GET请求时直接通过URL参数传递：`/api/auth/code/send?phone=13812345678&type=login`

### 使用验证码登录

- **URL**: `/api/auth/login/code`
- **方法**: POST
- **参数**:
  - `phone`: 手机号
  - `code`: 验证码

## 用户相关接口

### 获取用户详细信息

- **URL**: `/api/user/profile-info`
- **方法**: GET
- **参数**:
  - `userId`: 用户ID

### 更新用户信息

- **URL**: `/api/user/update-info`
- **方法**: POST
- **请求体**:
  ```json
  {
    "userId": "用户ID",
    "nickname": "昵称",
    "gender": "male/female",
    "birthday": "YYYY-MM-DD格式日期",
    "avatar": "头像路径"
  }
  ```

### 更新用户手机号

- **URL**: `/api/user/update-phone`
- **方法**: POST
- **请求体**:
  ```json
  {
    "userId": "用户ID",
    "phone": "新手机号",
    "code": "验证码"
  }
  ```
- **说明**: 需要先使用`/api/auth/code/send`发送验证码，type参数为"update_phone"

### 获取用户默认地址

- **URL**: `/api/user/default-address`
- **方法**: GET
- **说明**: 该接口使用Authorization头部中的token识别用户身份，无需传递userId参数

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

## 地址相关接口

### 获取用户默认地址

- **URL**: `/api/user/default-address`
- **方法**: GET
- **说明**: 该接口通过Authorization头部中的token识别用户，无需传递userId参数

### 获取用户所有地址

- **URL**: `/api/user/addresses?userId={userId}`
- **方法**: GET

### 添加用户地址

- **URL**: `/api/user/address`
- **方法**: POST
- **请求体**:
  ```json
  {
    "contactName": "联系人姓名",
    "gender": "male/female",
    "phone": "联系电话",
    "address": "详细地址",
    "isDefault": true/false
  }
  ```

### 更新用户地址

- **URL**: `/api/user/address/{addressId}`
- **方法**: PUT
- **参数**:
  - `addressId`: 地址ID
- **请求体**:
  ```json
  {
    "contactName": "联系人姓名",
    "gender": "male/female",
    "phone": "联系电话",
    "address": "详细地址",
    "isDefault": true/false
  }
  ```

### 设置默认地址

- **URL**: `/api/user/address/{addressId}/default`
- **方法**: PUT
- **参数**:
  - `addressId`: 要设置为默认的地址ID

### 删除用户地址

- **URL**: `/api/user/address/{addressId}`
- **方法**: DELETE
- **参数**:
  - `addressId`: 要删除的地址ID
  
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

## 订单相关接口

### 创建订单

- **URL**: `/api/orders`
- **方法**: POST
- **请求体**:
  ```json
  {
    "userId": "用户ID",
    "totalAmount": "订单总金额",
    "discountAmount": "优惠金额",
    "actualAmount": "实付金额",
    "couponId": "优惠券ID",
    "deliveryType": "配送方式(self/delivery)",
    "storeName": "店铺名称",
    "storeAddress": "店铺地址",
    "contactName": "联系人",
    "contactPhone": "联系电话",
    "deliveryAddress": "配送地址",
    "orderItems": "订单商品JSON"
  }
  ```

### 获取用户所有订单

- **URL**: `/api/orders/user/{userId}`
- **方法**: GET
- **参数**:
  - `userId`: 用户ID

### 获取用户指定状态的订单

- **URL**: `/api/orders/user/{userId}/status/{status}`
- **方法**: GET
- **参数**:
  - `userId`: 用户ID
  - `status`: 订单状态(pending/paid/completed/cancelled/refunded)

### 获取订单详情

- **URL**: `/api/orders/{orderId}`
- **方法**: GET
- **参数**:
  - `orderId`: 订单ID

### 取消订单

- **URL**: `/api/orders/{orderId}/cancel`
- **方法**: PUT
- **参数**:
  - `orderId`: 订单ID

### 支付订单

- **URL**: `/api/orders/{orderId}/pay`
- **方法**: PUT
- **参数**:
  - `orderId`: 订单ID
- **请求体**:
  ```json
  {
    "paymentMethod": "支付方式"
  }
  ```

### 完成订单

- **URL**: `/api/orders/{orderId}/complete`
- **方法**: PUT
- **参数**:
  - `orderId`: 订单ID

### 删除订单

- **URL**: `/api/orders/{orderId}`
- **方法**: DELETE
- **参数**:
  - `orderId`: 订单ID

## 一起喝相关接口

### 创建邀请

- **URL**: `/api/together-drink/invitations`
- **方法**: POST
- **请求体**:
  ```json
  {
    "userId": "创建者用户ID",
    "productId": "产品ID",
    "productName": "产品名称",
    "productImage": "产品图片",
    "productPrice": "产品价格",
    "participantsLimit": "参与人数限制",
    "expireTime": "过期时间（可选）"
  }
  ```

### 获取邀请详情

- **URL**: `/api/together-drink/invitations/{invitationId}`
- **方法**: GET
- **参数**:
  - `invitationId`: 邀请ID

### 通过邀请码获取邀请

- **URL**: `/api/together-drink/invitations/code/{inviteCode}`
- **方法**: GET
- **参数**:
  - `inviteCode`: 邀请码

### 加入邀请

- **URL**: `/api/together-drink/invitations/{invitationId}/join`
- **方法**: POST
- **参数**:
  - `invitationId`: 邀请ID
- **请求体**:
  ```json
  {
    "userId": "参与者用户ID"
  }
  ```

### 取消邀请

- **URL**: `/api/together-drink/invitations/{invitationId}/cancel`
- **方法**: PUT
- **参数**:
  - `invitationId`: 邀请ID
- **请求体**:
  ```json
  {
    "userId": "取消者用户ID（必须是创建者）"
  }
  ```

### 完成邀请并创建订单

- **URL**: `/api/together-drink/invitations/{invitationId}/complete`
- **方法**: POST
- **参数**:
  - `invitationId`: 邀请ID
- **请求体**:
  ```json
  {
    "orderAddress": "订单配送地址"
  }
  ```

### 获取用户参与的邀请

- **URL**: `/api/together-drink/invitations/user/{userId}`
- **方法**: GET
- **参数**:
  - `userId`: 用户ID
