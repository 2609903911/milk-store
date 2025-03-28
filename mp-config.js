// 微信小程序配置文件
// 此文件用于解决微信小程序网络请求限制问题

// 在微信开发工具中需要:
// 1. 点击右上角【详情】按钮
// 2. 勾选【不校验合法域名、web-view(业务域名)、TLS版本以及HTTPS证书】
// 3. 点击【刷新】按钮重新编译

// 仅用于开发阶段，发布前请在微信公众平台配置合法域名
module.exports = {
  // 开发环境配置
  dev: {
    // 禁用所有日志
    disableLog: true,
    // 网络设置
    network: {
      // 忽略域名校验
      ignoreCheckDomain: true
    }
  }
};
