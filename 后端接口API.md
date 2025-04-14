# 奶茶店后端API接口文档

## 首页轮播图产品接口

### 获取所有轮播图产品

• **URL**: `/api/banners`
• **方法**: `GET`
• **需要认证**: 否
• **参数**: 无

## 城市接口

### 获取所有城市数据

• **URL**: `/api/cities`
• **方法**: `GET`
• **需要认证**: 否
• **参数**: 无

### 获取热门城市

• **URL**: `/api/cities/hot`
• **方法**: `GET`
• **需要认证**: 否
• **参数**: 无

### 获取特定字母开头的城市

• **URL**: `/api/cities/letter/{letter}`
• **方法**: `GET`
• **需要认证**: 否
• **参数**: 
  • `letter`: 路径参数，城市拼音首字母（A-Z）

## 产品接口

### 获取所有产品

• **URL**: `/api/milk-products`
• **方法**: `GET`
• **需要认证**: 否
• **参数**: 无

### 获取所有产品（包括非活跃产品）

• **URL**: `/api/milk-products/all`
• **方法**: `GET`
• **需要认证**: 是（管理员权限）
• **参数**: 无

### 根据ID获取产品

• **URL**: `/api/milk-products/{id}`
• **方法**: `GET`
• **需要认证**: 否
• **参数**: 
  • `id`: 路径参数，产品ID

### 根据分类获取产品

• **URL**: `/api/milk-products/category/{categoryId}`
• **方法**: `GET`
• **需要认证**: 否
• **参数**: 
  • `categoryId`: 路径参数，分类ID

### 根据产品

• **URL**: `/api/milk-products/search`
• **方法**: `GET`
• **需要认证**: 否
• **参数**: 
  • `name`:参数，产品名称关键词

## 产品分类接口

### 获取所有产品分类

• **URL**: `/api/categories`
• **方法**: `GET`
• ****: 否
• **参数**: 无

### 根据ID获取产品分类

• **URL**: `/api/categories/{id}`
• **方法**: `GET`
• **需要认证**: 否
• **参数**: 
  • `id`: 路径参数，分类ID

## 勋章接口

### 获取所有勋章类型

• **URL**: `/api/medals/types`
• **方法**: `GET`
• **需要认证**: 否
• **参数**: 无

### 获取所有勋章

• **URL**: `/api/medals`
• **方法**: `GET`
• **需要认证**: 否
• **参数**: 无

### 根据类型获取勋章

• **URL**: `/api/medals/type/{typeId}`
• **方法**: `GET`
• **需要认证**: 否
• **参数**: 
  • `typeId`: 路径参数，勋章类型ID

### 获取用户拥有的勋章

• **URL**: `/api/medals/user/{userId}`
• **方法**: `GET`
• **需要认证**: 是
• **参数**: 
  • `userId`: 路径参数，用户ID

## 用户优惠券接口

### 获取用户优惠券

• **URL**: `/api/user-coupons/user/{userId}`
• **方法**: `GET`
• **需要认证**: 是
• **参数**: 
  • `userId`: 路径参数，用户ID

### 获取用户优惠券（包含模板信息）

• **URL**: `/api/user-coupons/user/{userId}/with-template`
• **方法**: `GET`
• **需要认证**: 是
• **参数**: 
  • `userId`: 路径参数，用户ID

### 获取指定状态的用户优惠券

• **URL**: `/api/user-coupons/user/{userId}/status/{status}`
• **方法**: `GET`
• **需要认证**: 是
• **参数**: 
  • `userId`: 路径参数，用户ID
  • `status`: 路径参数，优惠券状态(valid-有效,used-已使用,expired-已过期)

### 获取指定状态的用户优惠券（包含模板信息）

• **URL**: `/api/user-coupons/user/{userId}/status/{status}/with-template`
• **方法**: `GET`
• **需要认证**: 是
• **参数**: 
  • `userId`: 路径参数，用户ID
  • `status`: 路径参数，优惠券状态(valid-有效,used-已使用,expired-已过期)

## 验证码登录接口

### 发送验证码

• **URL**: `/api/auth/code/send`
• **方法**: `POST`
• **需要认证**: 否
• **参数**: 
  • `phone`: 必填，手机号码
  • `type`: 可选，验证码类型，默认为"login"。可选值：login(登录)、register(注册)、resetPassword(重置密码)

### 验证码登录

• **URL**: `/api/auth/login/code`
• **方法**: `POST`
• **需要认证**: 否
• **参数**: 
  • `phone`: 必填，手机号码
  • `code`: 必填，验证码