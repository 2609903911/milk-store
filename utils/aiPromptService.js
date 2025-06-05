/**
 * AI提示服务
 * 为AI助手提供上下文和知识库
 */

import { userState } from "./userState";
import { getProductData } from "./productService";

/**
 * 生成系统提示信息
 * @returns {String} 系统提示信息
 */
export const generateSystemPrompt = async () => {
  // 获取产品信息
  let productsInfo = [];
  try {
    // 获取分类和产品数据
    const categoriesWithProducts = await getProductData();

    // 将产品平铺到一个数组
    if (categoriesWithProducts && categoriesWithProducts.length > 0) {
      categoriesWithProducts.forEach((category) => {
        if (category.products && category.products.length > 0) {
          category.products.forEach((product) => {
            productsInfo.push({
              name: product.name,
              price: product.price,
              description: product.desc,
              category: category.name,
            });
          });
        }
      });
    }
  } catch (error) {
    productsInfo = [];
  }

  // 基础提示信息
  let prompt = `你是熊猫奶茶店的AI助手，负责回答用户关于奶茶产品、优惠活动、门店信息等问题。
请保持友好、专业的态度，简明扼要地回答问题。所有回答必须使用中文。

熊猫奶茶店的信息:
- 成立时间: 2021年
- 主营产品: 各类奶茶、果茶、特调饮品
- 门店地址: 主城区共有15家门店
- 营业时间: 早上10:00至晚上22:00
- 配送范围: 门店3公里内免费配送`;

  // 添加产品信息
  if (productsInfo && productsInfo.length > 0) {
    prompt += `\n\n主要产品列表:`;
    productsInfo.slice(0, 10).forEach((product) => {
      prompt += `\n- ${product.name}: ${product.price}元 (${product.description}) - 分类: ${product.category}`;
    });
  }

  // 添加当前优惠活动信息
  prompt += `\n\n当前优惠活动:
- 新用户首单立减5元
- 会员日(每月1日和15日)全场8.5折
- 下午茶时段(14:00-17:00)指定饮品第二杯半价
- 集满10个印章可兑换任意一杯中杯饮品`;

  // 添加用户信息(如果已登录)
  if (
    userState &&
    userState.userId &&
    userState.userId.indexOf("guest_") === -1
  ) {
    prompt += `\n\n当前用户信息:
- 会员等级: ${userState.memberLevel || 0}级
- 积分: ${userState.points || 0}点
- 优惠券数量: ${userState.coupons ? userState.coupons.length : 0}张`;
  }

  return prompt;
};

/**
 * 获取常见问题和回答
 * @returns {Array} 问答对数组
 */
export const getCommonQA = () => {
  return [
    {
      question: "熊猫奶茶的招牌饮品是什么?",
      answer:
        "我们的招牌饮品是'熊猫珍珠奶茶'和'杨梅吐气'，前者是经典奶茶配上Q弹珍珠，后者是杨梅汁与气泡水的清爽组合。",
    },
    {
      question: "如何成为会员?",
      answer:
        "您可以在我们的小程序或APP中注册账号，完成手机验证后即可成为会员，首次消费即可获得新人专属优惠。",
    },
    {
      question: "有没有糖分低的饮品推荐?",
      answer:
        "我们所有饮品都可以定制糖度，从无糖到全糖。特别推荐'乌龙青茶'和'满杯百香果'，这两款饮品即使选择低糖也不会影响口感。",
    },
  ];
};
