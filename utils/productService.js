/**
 * 产品服务
 * 提供产品相关的功能
 */

/**
 * 获取产品列表
 * @returns {Promise<Array>} 产品列表
 */
export const getProductList = async () => {
  // 模拟产品数据，实际应用中应该从API获取
  return [
    {
      id: 'p001',
      name: '熊猫珍珠奶茶',
      price: 18,
      description: '招牌奶茶，口感香浓，珍珠Q弹',
      category: '奶茶',
      image: '/static/images/products/milktea1.png',
      isPopular: true
    },
    {
      id: 'p002',
      name: '杨梅吐气',
      price: 19,
      description: '杨梅汁与气泡水结合，酸甜清爽',
      category: '果茶',
      image: '/static/images/products/fruittea1.png',
      isPopular: true
    },
    {
      id: 'p003',
      name: '芋泥啵啵奶茶',
      price: 22,
      description: '香浓奶茶搭配芋泥和芋圆，层次丰富',
      category: '奶茶',
      image: '/static/images/products/milktea2.png',
      isPopular: true
    },
    {
      id: 'p004',
      name: '芝士草莓茉莉',
      price: 23,
      description: '茉莉花茶底搭配草莓果酱和芝士奶盖',
      category: '果茶',
      image: '/static/images/products/fruittea2.png',
      isPopular: false
    },
    {
      id: 'p005',
      name: '椰云拿铁',
      price: 20,
      description: '意式浓缩咖啡搭配椰乳奶盖',
      category: '咖啡',
      image: '/static/images/products/coffee1.png',
      isPopular: false
    }
  ];
}; 