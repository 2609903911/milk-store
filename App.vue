<script>
export default {
    onLaunch: function () {
        console.log('App Launch')
    },
    onShow: function () {
        console.log('App Show')
    },
    onHide: function () {
        console.log('App Hide')
    }
}
</script>

<style>
/*每个页面公共css */

/* 全局样式 */
page {
    font-family: Helvetica Neue, Helvetica, sans-serif;
    font-size: 28rpx;
    color: #333;
}

/* 引入图标字体 */
@font-face {
    font-family: 'iconfont';
    src: url('/uni_modules/uni-icons/components/uni-icons/uniicons.ttf');
}

.iconfont {
    font-family: 'iconfont' !important;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* 定义图标映射 */
.icon-search:before {
    content: '\e654';
}

.icon-bars:before {
    content: '\e627';
}

.icon-notification:before {
    content: '\e6a6';
}

.icon-right:before {
    content: '\e6a3';
}
</style>
