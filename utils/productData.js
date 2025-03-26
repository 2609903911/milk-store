// 初始的产品数据
const defaultProductData = [
    {
        name: '招牌奶茶',
        products: [
            {
                image: '/static/images/hot01.png',
                name: '杨梅吐气',
                desc: '杨梅与气泡水的完美融合',
                price: 12.0
            },
            {
                image: '/static/images/hot02.png',
                name: '手作米麻薯',
                desc: '手工制作的米麻薯，口感Q弹',
                price: 10.0
            },
            {
                image: '/static/images/hot03.png',
                name: '满杯芭乐',
                desc: '新鲜芭乐与气泡水的完美结合',
                price: 15.0
            },
            {
                image: '/static/images/hot04.png',
                name: '抹茶奶绿',
                desc: '抹茶与奶绿的清新搭配',
                price: 10.0
            },
            {
                image: '/static/images/hot05.png',
                name: '喜凤梨',
                desc: '凤梨与气泡水的甜蜜组合',
                price: 12.0
            }
        ]
    },
    {
        name: '真鲜奶茶',
        products: [
            {
                image: '/static/images/new01.png',
                name: '经典奶茶',
                desc: '选用进口奶源，醇香浓郁',
                price: 15.0
            },
            {
                image: '/static/images/new02.png',
                name: '红豆奶茶',
                desc: '香甜红豆与奶茶的经典搭配',
                price: 18.0
            },
            {
                image: '/static/images/new03.png',
                name: '布丁奶茶',
                desc: 'Q弹布丁与香浓奶茶的融合',
                price: 20.0
            },
            {
                image: '/static/images/new04.png',
                name: '珍珠奶茶',
                desc: '嚼劲十足的珍珠与奶茶的完美融合',
                price: 16.0
            },
            {
                image: '/static/images/new05.png',
                name: '芋圆奶茶',
                desc: 'Q弹芋圆与丝滑奶茶的组合',
                price: 14.0
            }
        ]
    },
    {
        name: '新品种草',
        products: [
            {
                image: '/static/images/classic01.png',
                name: '芝芝莓莓',
                desc: '草莓与芝士的梦幻搭配',
                price: 22.0
            },
            {
                image: '/static/images/classic02.png',
                name: '多肉葡萄',
                desc: '多肉与葡萄的创新组合',
                price: 20.0
            },
            {
                image: '/static/images/classic03.png',
                name: '芒果雪冰',
                desc: '新鲜芒果加上细腻雪冰',
                price: 18.0
            },
            {
                image: '/static/images/classic04.png',
                name: '椰云拿铁',
                desc: '丝滑拿铁与椰云的结合',
                price: 16.0
            },
            {
                image: '/static/images/classic05.png',
                name: '桃桃乌龙',
                desc: '乌龙茶与水蜜桃的清新口味',
                price: 19.0
            }
        ]
    },
    {
        name: '清爽鲜果茶',
        products: [
            {
                image: '/static/images/fruit01.png',
                name: '满杯百香',
                desc: '新鲜百香果，酸甜可口',
                price: 16.0
            },
            {
                image: '/static/images/fruit02.png',
                name: '柠檬绿茶',
                desc: '清新柠檬与绿茶的搭配',
                price: 14.0
            },
            {
                image: '/static/images/fruit03.png',
                name: '蜜桃乌龙',
                desc: '香甜蜜桃与乌龙茶的结合',
                price: 18.0
            },
            {
                image: '/static/images/fruit04.png',
                name: '金桔柠檬',
                desc: '酸甜可口的金桔柠檬',
                price: 15.0
            },
            {
                image: '/static/images/fruit05.png',
                name: '青提乌龙',
                desc: '清爽青提与醇香乌龙茶',
                price: 17.0
            }
        ]
    }
]

// 存储键名
const STORAGE_KEY = 'milk_tea_products'

// 保存产品数据到本地存储
export const saveProductData = (data) => {
    try {
        uni.setStorageSync(STORAGE_KEY, JSON.stringify(data))
        console.log('产品数据保存成功')
        return true
    } catch (e) {
        console.error('保存产品数据失败：', e)
        return false
    }
}

// 从本地存储获取产品数据
export const getProductData = () => {
    try {
        const storageData = uni.getStorageSync(STORAGE_KEY)
        if (storageData) {
            return JSON.parse(storageData)
        } else {
            // 如果本地没有数据，初始化并存储默认数据
            saveProductData(defaultProductData)
            return defaultProductData
        }
    } catch (e) {
        console.error('获取产品数据失败：', e)
        return defaultProductData
    }
}

// 重置产品数据为默认数据
export const resetProductData = () => {
    return saveProductData(defaultProductData)
}

// 更新特定产品信息
export const updateProduct = (categoryIndex, productIndex, updatedProduct) => {
    try {
        const allProducts = getProductData()
        
        // 确保索引有效
        if (categoryIndex >= 0 && 
            categoryIndex < allProducts.length && 
            productIndex >= 0 && 
            productIndex < allProducts[categoryIndex].products.length) {
            
            // 更新产品
            allProducts[categoryIndex].products[productIndex] = {
                ...allProducts[categoryIndex].products[productIndex],
                ...updatedProduct
            }
            
            // 保存更新后的数据
            return saveProductData(allProducts)
        }
        return false
    } catch (e) {
        console.error('更新产品失败：', e)
        return false
    }
}

// 添加新产品到指定分类
export const addProduct = (categoryIndex, newProduct) => {
    try {
        const allProducts = getProductData()
        
        // 确保分类索引有效
        if (categoryIndex >= 0 && categoryIndex < allProducts.length) {
            // 添加新产品
            allProducts[categoryIndex].products.push(newProduct)
            
            // 保存更新后的数据
            return saveProductData(allProducts)
        }
        return false
    } catch (e) {
        console.error('添加产品失败：', e)
        return false
    }
}

// 删除产品
export const deleteProduct = (categoryIndex, productIndex) => {
    try {
        const allProducts = getProductData()
        
        // 确保索引有效
        if (categoryIndex >= 0 && 
            categoryIndex < allProducts.length && 
            productIndex >= 0 && 
            productIndex < allProducts[categoryIndex].products.length) {
            
            // 删除产品
            allProducts[categoryIndex].products.splice(productIndex, 1)
            
            // 保存更新后的数据
            return saveProductData(allProducts)
        }
        return false
    } catch (e) {
        console.error('删除产品失败：', e)
        return false
    }
}

// 添加新分类
export const addCategory = (newCategory) => {
    try {
        const allProducts = getProductData()
        
        // 添加新分类
        allProducts.push({
            name: newCategory,
            products: []
        })
        
        // 保存更新后的数据
        return saveProductData(allProducts)
    } catch (e) {
        console.error('添加分类失败：', e)
        return false
    }
}

// 删除分类
export const deleteCategory = (categoryIndex) => {
    try {
        const allProducts = getProductData()
        
        // 确保分类索引有效
        if (categoryIndex >= 0 && categoryIndex < allProducts.length) {
            // 删除分类
            allProducts.splice(categoryIndex, 1)
            
            // 保存更新后的数据
            return saveProductData(allProducts)
        }
        return false
    } catch (e) {
        console.error('删除分类失败：', e)
        return false
    }
}

// 搜索产品
export const searchProducts = (keyword) => {
    try {
        if (!keyword) return []
        
        const allProducts = getProductData()
        const results = []
        
        // 搜索所有分类中的产品
        allProducts.forEach(category => {
            const matchedProducts = category.products.filter(product => 
                product.name.includes(keyword) || 
                product.desc.includes(keyword)
            )
            
            if (matchedProducts.length > 0) {
                matchedProducts.forEach(product => {
                    results.push({
                        ...product,
                        category: category.name
                    })
                })
            }
        })
        
        return results
    } catch (e) {
        console.error('搜索产品失败：', e)
        return []
    }
}

// 初始化数据，确保第一次使用时本地存储有数据
export const initProductData = () => {
    const existingData = uni.getStorageSync(STORAGE_KEY)
    if (!existingData) {
        saveProductData(defaultProductData)
    }
    return true
}

// 默认导出
export default {
    getProductData,
    saveProductData,
    resetProductData,
    updateProduct,
    addProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    searchProducts,
    initProductData
} 