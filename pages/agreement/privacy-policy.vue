<template>
    <view class="agreement-container">
        <!-- 导航栏 -->
        <view class="navbar">
            <view class="back-btn" @click="goBack">
                <uni-icons type="left" size="24"></uni-icons>
            </view>
            <view class="title">隐私政策</view>
            <view class="right-placeholder"></view>
        </view>

        <!-- 协议内容 -->
        <scroll-view scroll-y class="agreement-content">
            <view class="content-block">
                <view class="section-title">隐私政策摘要</view>
                <view class="section-text">
                    本隐私政策适用于奶茶店应用程序。我们非常重视您的隐私保护，并会尽全力保护您的个人信息安全。本政策旨在帮助您了解我们如何收集、使用、存储、共享和保护您的个人信息，以及您享有的相关权利。
                </view>
            </view>

            <view class="content-block">
                <view class="section-title">1. 我们收集的信息</view>
                <view class="section-text">
                    1.1
                    您提供的信息：当您注册账户、下单购买商品、参与营销活动或联系客服时，我们会收集您主动提供的信息，包括但不限于：
                </view>
                <view class="section-text indent">
                    (1) 个人身份信息：如姓名、电话号码、电子邮箱地址等；<br />
                    (2) 订单信息：如购买的商品、支付信息、配送地址等；<br />
                    (3) 您通过客服或参与问卷调查时向我们提供的信息。
                </view>
                <view class="section-text">
                    1.2
                    我们自动收集的信息：当您使用我们的服务时，我们可能会自动收集以下信息：
                </view>
                <view class="section-text indent">
                    (1)
                    设备信息：如设备型号、操作系统版本、设备设置、唯一设备标识符等；<br />
                    (2)
                    日志信息：如IP地址、浏览器类型、访问日期和时间、网页浏览记录等；<br />
                    (3) 位置信息：如您的GPS位置、WLAN接入点等网络信息。
                </view>
                <view class="section-text">
                    1.3
                    来自第三方的信息：我们可能从第三方合作伙伴获取关于您的信息，这些信息包括：
                </view>
                <view class="section-text indent">
                    (1) 来自关联公司的信息；<br />
                    (2) 来自合作伙伴的共享信息；<br />
                    (3) 来自您授权使用的第三方账号（如微信、支付宝等）的信息。
                </view>
            </view>

            <view class="content-block">
                <view class="section-title">2. 信息的使用</view>
                <view class="section-text">
                    2.1 我们使用收集的信息主要用于以下目的：
                </view>
                <view class="section-text indent">
                    (1) 提供、维护和改进我们的服务；<br />
                    (2) 处理您的订单，包括配送和售后服务；<br />
                    (3) 向您推送相关的营销信息和促销活动；<br />
                    (4) 进行数据分析，以改善用户体验；<br />
                    (5) 预防和打击欺诈等非法行为；<br />
                    (6) 遵守法律法规的要求。
                </view>
            </view>

            <view class="content-block">
                <view class="section-title">3. 信息的共享与披露</view>
                <view class="section-text">
                    3.1 我们不会向第三方出售您的个人信息。
                </view>
                <view class="section-text">
                    3.2 仅在以下情况下，我们会共享您的个人信息：
                </view>
                <view class="section-text indent">
                    (1) 在获得您的明确同意后；<br />
                    (2)
                    与提供服务相关的合作伙伴共享（如物流服务提供商、支付服务提供商等）；<br />
                    (3) 基于法律法规的要求、强制性的行政或司法要求；<br />
                    (4)
                    为保护我们的权益、财产或安全以及其他用户或公众的权益、财产或安全；<br />
                    (5) 合并、收购或破产清算等原因导致的信息转移。
                </view>
            </view>

            <view class="content-block">
                <view class="section-title">4. 信息存储与保护</view>
                <view class="section-text">
                    4.1
                    信息存储的地点：我们会按照法律法规规定，将在中国境内收集的用户个人信息存储在中国境内。
                </view>
                <view class="section-text">
                    4.2
                    信息存储的期限：我们只会在达成本政策所述目的所需的期限内保留您的个人信息，除非法律有强制的存留要求。
                </view>
                <view class="section-text">
                    4.3
                    信息安全保护措施：我们已采取符合业界标准的安全防护措施保护您的个人信息，防止数据遭到未经授权的访问、公开披露、使用、修改、损坏或丢失。
                </view>
                <view class="section-text">
                    4.4
                    请注意，虽然我们已采取合理的安全措施，但互联网环境并非百分之百安全，我们无法保证您的个人信息绝对安全。
                </view>
            </view>

            <view class="content-block">
                <view class="section-title">5. Cookie 和同类技术的使用</view>
                <view class="section-text">
                    5.1 我们使用Cookie和同类技术来优化用户体验，包括：
                </view>
                <view class="section-text indent">
                    (1) 记住您的身份，方便您下次登录；<br />
                    (2) 分析您使用我们服务的情况，以便改进服务；<br />
                    (3) 为您提供个性化的内容和推荐。
                </view>
                <view class="section-text">
                    5.2
                    您可以通过浏览器设置拒绝或管理Cookie。但请注意，停用Cookie可能会影响您使用我们服务的部分功能。
                </view>
            </view>

            <view class="content-block">
                <view class="section-title">6. 您的权利</view>
                <view class="section-text">
                    6.1 根据相关法律法规，您对个人信息享有以下权利：
                </view>
                <view class="section-text indent">
                    (1) 访问权：您有权访问我们收集的您的个人信息；<br />
                    (2) 更正权：您有权要求我们更正不准确的个人信息；<br />
                    (3) 删除权：在特定情况下，您有权删除您的个人信息；<br />
                    (4)
                    反对权：在特定情况下，您有权反对我们处理您的个人信息；<br />
                    (5)
                    撤回同意权：对于基于同意的数据处理，您有权随时撤回同意；<br />
                    (6) 投诉权：您有权向监管机构投诉我们的数据处理行为。
                </view>
                <view class="section-text">
                    6.2
                    如您要行使这些权利，可以通过本政策末尾提供的联系方式与我们联系。
                </view>
            </view>

            <view class="content-block">
                <view class="section-title">7. 儿童信息保护</view>
                <view class="section-text">
                    7.1
                    我们的服务主要面向成人。如果没有父母或监护人的同意，我们不会故意收集不满14周岁儿童的个人信息。
                </view>
                <view class="section-text">
                    7.2
                    如果您是不满14周岁的儿童，请在使用我们的服务前取得父母或监护人的同意。
                </view>
                <view class="section-text">
                    7.3
                    如我们发现自己在未获父母或监护人同意的情况下收集了儿童的个人信息，我们会尽快删除相关数据。
                </view>
            </view>

            <view class="content-block">
                <view class="section-title">8. 本政策的更新</view>
                <view class="section-text">
                    8.1
                    我们可能会不时更新本隐私政策，更新将通过在应用内发布通知或其他适当方式告知您。
                </view>
                <view class="section-text">
                    8.2 对于重大变更，我们还会提前通知您，并获取您的同意。
                </view>
                <view class="section-text">
                    8.3 本政策最近更新日期：2024年7月1日
                </view>
            </view>

            <view class="content-block">
                <view class="section-title">9. 联系我们</view>
                <view class="section-text">
                    9.1
                    如果您对本隐私政策有任何疑问、意见或建议，请通过以下方式与我们联系：
                </view>
                <view class="section-text indent">
                    电子邮件：privacy@milkstore.com<br />
                    客服电话：400-123-4567<br />
                    办公地址：广东省广州市天河区科技园A栋101室
                </view>
                <view class="section-text">
                    9.2 我们将在收到您的问题后的15个工作日内予以回复。
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
export default {
    data() {
        return {}
    },
    methods: {
        goBack() {
            uni.navigateBack()
        }
    }
}
</script>

<style lang="scss" scoped>
.agreement-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #fff;
    padding-top: calc(var(--status-bar-height) + 20rpx);
    box-sizing: border-box;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90rpx;
    padding: 0 30rpx;
    background-color: #fff;
    border-bottom: 1px solid #f0f0f0;
    position: relative;
    z-index: 100;
    margin-bottom: 20rpx;
}

.back-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
}

.title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
}

.right-placeholder {
    width: 60rpx;
}

.agreement-content {
    flex: 1;
    padding: 30rpx 40rpx 40rpx;
    box-sizing: border-box;
}

.content-block {
    margin-bottom: 40rpx;
}

.section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
}

.section-text {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
    margin-bottom: 16rpx;
    text-align: justify;
}

.indent {
    padding-left: 20rpx;
}
</style> 