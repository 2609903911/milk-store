<template>
    <view class="agreement-container">
        <!-- 导航栏 -->
        <view class="navbar">
            <view class="back-btn" @click="goBack">
                <uni-icons type="left" size="24"></uni-icons>
            </view>
            <view class="title">用户协议</view>
            <view class="right-placeholder"></view>
        </view>

        <!-- 协议内容 -->
        <scroll-view scroll-y class="agreement-content">
            <view class="content-block">
                <view class="section-title">欢迎使用奶茶店服务</view>
                <view class="section-text">
                    感谢您选择奶茶店服务。请您务必审慎阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款，以及开通或使用某项服务的单独协议。
                </view>
                <view class="section-text">
                    除非您已阅读并接受本协议所有条款，否则您无权使用奶茶店服务。您使用奶茶店服务的行为即视为您已阅读并同意本协议的约束。
                </view>
            </view>

            <view class="content-block">
                <view class="section-title">1. 服务内容</view>
                <view class="section-text">
                    1.1
                    奶茶店服务是指奶茶店通过其开发的应用程序向用户提供的网上订购奶茶、管理会员、获取优惠及相关服务。
                </view>
                <view class="section-text">
                    1.2
                    奶茶店可能会根据实际情况对服务内容进行调整，并保留随时变更、中断或终止部分或全部网络服务的权利。
                </view>
                <view class="section-text">
                    1.3
                    奶茶店服务仅供个人用户使用，商业机构、组织等使用须经奶茶店另行授权。
                </view>
            </view>

            <view class="content-block">
                <view class="section-title">2. 用户注册</view>
                <view class="section-text">
                    2.1 您在使用本服务前需要注册成为奶茶店的用户。
                </view>
                <view class="section-text">
                    2.2
                    在注册过程中，您需要提供真实、准确、完整的个人资料，并保证资料的真实性、准确性和完整性。
                </view>
                <view class="section-text">
                    2.3
                    如您提供的注册资料不合法、不真实、不准确、不详尽的，需承担因此引起的相应责任及后果。
                </view>
                <view class="section-text">
                    2.4
                    您注册成功后，将获得一个账号和密码，您应当妥善保管账号及密码，对您账号下的所有行为负责。
                </view>
            </view>

            <view class="content-block">
                <view class="section-title">3. 用户行为规范</view>
                <view class="section-text">
                    3.1
                    您保证不会利用本服务进行任何违法或不当的活动，包括但不限于以下行为:
                </view>
                <view class="section-text indent">
                    (1) 发布或传播违反国家法律法规的信息；<br />
                    (2)
                    散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的信息；<br />
                    (3) 侮辱或者诽谤他人，侵害他人合法权益；<br />
                    (4) 冒充他人，恶意注册账号；<br />
                    (5) 干扰或破坏本服务的正常运行和秩序；<br />
                    (6)
                    其他违反法律法规、社会公德、公序良俗或侵犯他人合法权益的行为。
                </view>
            </view>

            <view class="content-block">
                <view class="section-title">4. 服务的中断或终止</view>
                <view class="section-text">
                    4.1
                    如您违反本协议中规定的使用规则，奶茶店有权中断或终止向您提供服务，且无须为此向您或任何第三方承担责任。
                </view>
                <view class="section-text">
                    4.2
                    当出现下列情形之一时，奶茶店有权不经事先通知，随时中断或终止向您提供部分或全部服务：
                </view>
                <view class="section-text indent">
                    (1) 您提供的个人资料不真实；<br />
                    (2) 您违反本服务条款的规定；<br />
                    (3) 按照法律规定或主管部门的要求；<br />
                    (4) 出于维护安全的需要；<br />
                    (5) 其他奶茶店认为需要终止服务的情况。
                </view>
            </view>

            <view class="content-block">
                <view class="section-title">5. 免责声明</view>
                <view class="section-text">
                    5.1
                    您明确了解并同意，基于以下原因而造成的，包括但不限于经济、信誉、数据等方面的损失或损害，奶茶店不承担任何直接、间接、附带、特别、衍生性或惩罚性赔偿责任：
                </view>
                <view class="section-text indent">
                    (1) 本服务使用或无法使用；<br />
                    (2) 通过本服务购买或获取的任何商品、数据、信息或服务；<br />
                    (3) 您的传输或数据遭到未获授权的访问或变更；<br />
                    (4) 任何第三方在本服务中所作的声明或行为；<br />
                    (5) 与本服务相关的其他事宜，包括疏忽。
                </view>
            </view>

            <view class="content-block">
                <view class="section-title">6. 知识产权</view>
                <view class="section-text">
                    6.1
                    奶茶店提供的网络服务中包含的任何文本、图片、图形、音视频等资料均受版权、商标或其他财产所有权法律的保护。
                </view>
                <view class="section-text">
                    6.2
                    未经奶茶店或相关权利人书面许可，您不得以任何方式使用、复制或传播上述任何内容。
                </view>
            </view>

            <view class="content-block">
                <view class="section-title">7. 法律适用与争议解决</view>
                <view class="section-text">
                    7.1
                    本协议的成立、生效、履行、解释及争议的解决均适用中华人民共和国法律。
                </view>
                <view class="section-text">
                    7.2
                    如您与奶茶店发生任何争议，双方应尽量友好协商解决；协商不成时，任何一方均可向奶茶店所在地的人民法院提起诉讼。
                </view>
            </view>

            <view class="content-block">
                <view class="section-title">8. 其他规定</view>
                <view class="section-text">
                    8.1 本协议中的标题仅为方便而设，不影响对条款本身的解释。
                </view>
                <view class="section-text">
                    8.2 本协议最终解释权归奶茶店所有。
                </view>
                <view class="section-text">
                    8.3 本协议更新时间：2024年7月1日
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