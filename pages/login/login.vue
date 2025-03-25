/**
 * 检查登录状态
 */
const checkLoginStatus = () => {
    try {
        // 从本地存储获取用户信息
        const userInfo = getUserInfo()
        
        // 如果有用户信息，则已登录
        if (userInfo && userInfo.userId) {
            isLogged.value = true
            
            // 设置为全局用户状态
            updateUserState(userInfo)
            
            // 记录登录时间
            recordLoginTime()
            
            console.log('用户已登录', userInfo)
            
            // 延迟一下自动跳转，以便用户看到登录页
            setTimeout(() => {
                // 跳转到主页
                uni.switchTab({
                    url: '/pages/home/home'
                })
            }, 1000)
        }
        // 注意：这里移除了自动创建用户信息的逻辑
    } catch (e) {
        console.error('检查登录状态出错', e)
    }
} 