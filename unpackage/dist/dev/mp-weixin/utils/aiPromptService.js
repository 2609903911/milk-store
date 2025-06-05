"use strict";
const utils_userState = require("./userState.js");
const utils_productService = require("./productService.js");
const generateSystemPrompt = async () => {
  let productsInfo = [];
  try {
    const categoriesWithProducts = await utils_productService.getProductData();
    if (categoriesWithProducts && categoriesWithProducts.length > 0) {
      categoriesWithProducts.forEach((category) => {
        if (category.products && category.products.length > 0) {
          category.products.forEach((product) => {
            productsInfo.push({
              name: product.name,
              price: product.price,
              description: product.desc,
              category: category.name
            });
          });
        }
      });
    }
  } catch (error) {
    productsInfo = [];
  }
  let prompt = `你是熊猫奶茶店的AI助手，负责回答用户关于奶茶产品、优惠活动、门店信息等问题。
请保持友好、专业的态度，简明扼要地回答问题。所有回答必须使用中文。

熊猫奶茶店的信息:
- 成立时间: 2021年
- 主营产品: 各类奶茶、果茶、特调饮品
- 门店地址: 主城区共有15家门店
- 营业时间: 早上10:00至晚上22:00
- 配送范围: 门店3公里内免费配送`;
  if (productsInfo && productsInfo.length > 0) {
    prompt += `

主要产品列表:`;
    productsInfo.slice(0, 10).forEach((product) => {
      prompt += `
- ${product.name}: ${product.price}元 (${product.description}) - 分类: ${product.category}`;
    });
  }
  prompt += `

当前优惠活动:
- 新用户首单立减5元
- 会员日(每月1日和15日)全场8.5折
- 下午茶时段(14:00-17:00)指定饮品第二杯半价
- 集满10个印章可兑换任意一杯中杯饮品`;
  if (utils_userState.userState && utils_userState.userState.userId && utils_userState.userState.userId.indexOf("guest_") === -1) {
    prompt += `

当前用户信息:
- 会员等级: ${utils_userState.userState.memberLevel || 0}级
- 积分: ${utils_userState.userState.points || 0}点
- 优惠券数量: ${utils_userState.userState.coupons ? utils_userState.userState.coupons.length : 0}张`;
  }
  return prompt;
};
exports.generateSystemPrompt = generateSystemPrompt;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/aiPromptService.js.map
