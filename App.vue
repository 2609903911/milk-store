<script>
import { initUserState, userState } from "./utils/userState";
import { loginUser } from "./utils/userService";
import { initUserData } from "./utils/userData";

export default {
  onLaunch: function () {
    // 初始化用户状态
    initUserState();

    // 初始化用户信息
    this.initUserInfo();

    // 初始化用户数据
    initUserData();
  },
  onShow: function () {},
  onHide: function () {},

  methods: {
    // 初始化用户信息
    initUserInfo() {
      try {
        // 检查全局用户状态是否已初始化
        if (!userState || !userState.userId) {
          this.createGuestUser();
        } else {
        }
      } catch (error) {}
    },

    // 创建游客用户（可选功能）
    createGuestUser() {
      // 自动创建一个游客账号
      const phoneNumber = "guest_" + Date.now();
      const { success, userInfo } = loginUser(phoneNumber);

      if (success) {
      } else {
      }
    },
  },
};
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
  font-family: "iconfont";
  src: url("/uni_modules/uni-icons/components/uni-icons/uniicons.ttf");
}

.iconfont {
  font-family: "iconfont" !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 定义图标映射 */
.icon-search:before {
  content: "\e654";
}

.icon-bars:before {
  content: "\e627";
}

.icon-notification:before {
  content: "\e6a6";
}

.icon-right:before {
  content: "\e6a3";
}

.icon-left:before {
  content: "\e6b7";
}
</style>
