<template>
    <view class="login-container">
        <!-- 标题栏 -->
        <view class="header">
            <view class="back-btn" @click="navBack">
                <text class="iconfont icon-left"></text>
            </view>
            <view class="title">授权登录</view>
            <view class="right-icons">
                <text class="iconfont icon-more-dot"></text>
            </view>
        </view>

        <!-- 登录图片 -->
        <view class="login-image">
            <image
                src="/static/images/login-image.png"
                mode="aspectFit"
            ></image>
        </view>

        <!-- 登录标语 -->
        <view class="login-slogan">首次登录即享新人专属礼</view>

        <!-- 手机号验证码登录表单 -->
        <view class="login-form">
            <view class="input-group">
                <input
                    type="number"
                    maxlength="11"
                    v-model="phone"
                    placeholder="请输入手机号"
                />
            </view>
            <view class="input-group code-group">
                <input
                    type="number"
                    maxlength="6"
                    v-model="code"
                    placeholder="请输入验证码"
                />
                <view
                    class="code-btn"
                    :class="{ disabled: counting }"
                    @click="getVerificationCode"
                >
                    {{ counting ? `重新获取(${counter}s)` : '获取验证码' }}
                </view>
            </view>
            <button class="login-btn" @click="handleLogin">登录</button>
        </view>

        <!-- 暂不登录 -->
        <view class="skip-login" @click="skipLogin"> 暂不登录 </view>

        <!-- 用户协议 -->
        <view class="agreement">
            <checkbox :checked="isAgree" @click="toggleAgreement"></checkbox>
            <text class="agreement-text">
                我已阅读并同意 <text class="agreement-link">《用户协议》</text>
                <text class="agreement-link">《用户隐私协议》</text>
            </text>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            phone: '', // 手机号
            code: '', // 验证码
            isAgree: true, // 是否同意协议
            counting: false, // 是否在倒计时
            counter: 60, // 倒计时秒数
            timer: null // 定时器
        }
    },
    methods: {
        // 返回上一页
        navBack() {
            uni.navigateBack()
        },

        // 获取验证码
        getVerificationCode() {
            // 仅UI展示，不需要实现功能
            if (this.counting) return

            this.counting = true
            this.counter = 60

            this.timer = setInterval(() => {
                this.counter--
                if (this.counter <= 0) {
                    clearInterval(this.timer)
                    this.counting = false
                }
            }, 1000)
        },

        // 处理登录
        handleLogin() {
            // 仅UI展示，不需要实现功能
            uni.showToast({
                title: '登录成功',
                icon: 'success'
            })

            // 登录成功后跳转到首页
            setTimeout(() => {
                uni.switchTab({
                    url: '/pages/home/home'
                })
            }, 1500)
        },

        // 切换协议同意状态
        toggleAgreement() {
            this.isAgree = !this.isAgree
        },

        // 暂不登录
        skipLogin() {
            // 跳转到首页
            uni.switchTab({
                url: '/pages/home/home'
            })
        }
    },
    // 组件销毁时清除定时器
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer)
        }
    }
}
</script>

<style lang="scss">
.login-container {
    padding: 0 30rpx;
    height: 100vh;
    background-color: #ffffff;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 88rpx;
        position: relative;

        .back-btn {
            width: 88rpx;
            height: 88rpx;
            display: flex;
            align-items: center;

            .iconfont {
                font-size: 40rpx;
            }
        }

        .title {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            font-size: 36rpx;
            font-weight: 500;
        }

        .right-icons {
            width: 88rpx;
            height: 88rpx;
            display: flex;
            align-items: center;
            justify-content: flex-end;

            .iconfont {
                font-size: 40rpx;
            }
        }
    }

    .login-image {
        display: flex;
        justify-content: center;
        margin: 60rpx 0;

        image {
            width: 400rpx;
            height: 300rpx;
        }
    }

    .login-slogan {
        font-size: 36rpx;
        font-weight: 500;
        text-align: center;
        margin-bottom: 60rpx;
    }

    .login-form {
        .input-group {
            height: 100rpx;
            border: 1px solid #e5e5e5;
            border-radius: 50rpx;
            padding: 0 30rpx;
            margin-bottom: 30rpx;
            display: flex;
            align-items: center;

            input {
                flex: 1;
                height: 100%;
                font-size: 30rpx;
            }
        }

        .code-group {
            display: flex;
            align-items: center;
            padding-right: 10rpx;

            .code-btn {
                width: 200rpx;
                height: 80rpx;
                line-height: 80rpx;
                text-align: center;
                background-color: #7facfa;
                color: #fff;
                font-size: 26rpx;
                border-radius: 40rpx;

                &.disabled {
                    background-color: #f5f5f5;
                    color: #999;
                }
            }
        }

        .login-btn {
            height: 100rpx;
            background-color: #7facfa;
            border-radius: 50rpx;
            color: #fff;
            font-size: 32rpx;
            font-weight: 500;
            margin-top: 60rpx;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .skip-login {
        font-size: 28rpx;
        color: #999;
        text-align: center;
        margin-top: 40rpx;
    }

    .agreement {
        position: fixed;
        bottom: 50rpx;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        color: #999;

        checkbox {
            transform: scale(0.7);
            margin-right: 5rpx;
        }

        .agreement-link {
            color: #7facfa;
        }
    }
}
</style>