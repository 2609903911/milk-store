"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_uniUtils = require("../../utils/uniUtils.js");
const utils_userData = require("../../utils/userData.js");
const utils_api_productApi = require("../../utils/api/productApi.js");
const utils_api_userApi = require("../../utils/api/userApi.js");
const utils_api_togetherDrinkApi = require("../../utils/api/togetherDrinkApi.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "together-drink",
  setup(__props) {
    const state = common_vendor.ref("initial");
    const product = common_vendor.ref({
      id: 1,
      name: "奶茶双人套餐",
      description: "两杯奶茶，一份甜蜜",
      price: 39.9,
      imageUrl: "/static/images/default-product.png"
    });
    const totalPrice = common_vendor.computed(() => {
      return product.value.price;
    });
    const userInfo = common_vendor.computed(() => {
      return {
        id: utils_userData.userData.userId,
        nickname: utils_userData.userData.nickname,
        avatar: utils_userData.userData.avatar
      };
    });
    const partnerInfo = common_vendor.ref({
      id: "",
      nickname: "",
      avatar: ""
    });
    const inviteCode = common_vendor.ref("");
    const inputCode = common_vendor.ref("");
    const countdown = common_vendor.ref(600);
    const countdownTimer = common_vendor.ref(null);
    const expireTime = common_vendor.ref(null);
    const invitationId = common_vendor.ref("");
    const deliveryType = common_vendor.ref("self");
    const storeAddress = common_vendor.ref({
      id: "",
      name: "",
      address: "",
      distance: ""
    });
    const userAddress = common_vendor.ref(null);
    common_vendor.ref(false);
    const isInitialized = common_vendor.ref(false);
    const fetchProductInfo = async (productId = 1) => {
      try {
        const productData = await utils_api_productApi.fetchProductById(productId);
        if (productData) {
          product.value = {
            id: productData.id,
            name: productData.name,
            description: productData.description || "特选双人奶茶套餐",
            price: productData.price,
            imageUrl: productData.imageUrl || "/static/images/default-product.png"
          };
        }
      } catch (error) {
        utils_uniUtils.toast("获取商品信息失败，使用默认商品", "none", 2e3);
      }
    };
    const formatCountdown = common_vendor.computed(() => {
      const minutes = Math.floor(countdown.value / 60);
      const seconds = countdown.value % 60;
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    });
    const generateInviteCode = async () => {
      if (!utils_userData.userData.userId) {
        utils_uniUtils.toast("请先登录后再创建邀请", "none", 2e3);
        setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "/pages/login/login"
          });
        }, 1500);
        return;
      }
      utils_uniUtils.toast("正在创建邀请...", "loading");
      try {
        const invitationData = {
          userId: utils_userData.userData.userId,
          productId: product.value.id,
          productName: product.value.name,
          productImage: product.value.imageUrl,
          productPrice: product.value.price,
          participantsLimit: 2,
          // 一起喝功能默认为2人
          expireTime: new Date(Date.now() + 6e5).toISOString()
          // 10分钟后过期
        };
        const response = await utils_api_togetherDrinkApi.createInvitation(invitationData);
        if (response && response.inviteCode) {
          invitationId.value = response.invitationId;
          inviteCode.value = response.inviteCode;
          handleInvitationSuccess();
        } else if (response && response.data && response.data.inviteCode) {
          invitationId.value = response.data.invitationId;
          inviteCode.value = response.data.inviteCode;
          handleInvitationSuccess();
        } else if (response && response.data && response.data.data && response.data.data.inviteCode) {
          invitationId.value = response.data.data.invitationId;
          inviteCode.value = response.data.data.inviteCode;
          handleInvitationSuccess();
        } else {
          if (response && response.statusCode === 200) {
            if (!inviteCode.value) {
              const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
              let tempCode = "";
              for (let i = 0; i < 8; i++) {
                tempCode += chars.charAt(Math.floor(Math.random() * chars.length));
              }
              inviteCode.value = tempCode;
            }
            handleInvitationSuccess();
          } else {
            utils_uniUtils.toast("创建邀请失败，请重试", "none");
          }
        }
      } catch (error) {
        utils_uniUtils.toast("创建邀请失败，请重试", "none");
      }
    };
    const handleInvitationSuccess = () => {
      state.value = "waiting";
      expireTime.value = new Date(
        Date.now() + countdown.value * 1e3
      ).toISOString();
      startCountdown();
      saveInvitationState();
      utils_uniUtils.toast("邀请已创建，请分享邀请码给好友", "success");
    };
    const startCountdown = () => {
      if (countdownTimer.value) {
        clearInterval(countdownTimer.value);
      }
      countdownTimer.value = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--;
        } else {
          clearInterval(countdownTimer.value);
          if (state.value === "waiting") {
            state.value = "initial";
            common_vendor.index.removeStorageSync("togetherDrinkState");
            utils_uniUtils.toast("邀请已过期");
          }
        }
      }, 1e3);
    };
    const formatInviteCode = () => {
      inputCode.value = inputCode.value.toUpperCase();
    };
    const joinByCode = async () => {
      if (inputCode.value.length < 8) {
        utils_uniUtils.toast("请输入完整的邀请码");
        return;
      }
      if (!utils_userData.userData.userId) {
        utils_uniUtils.toast("请先登录后再加入邀请", "none", 2e3);
        setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "/pages/login/login"
          });
        }, 1500);
        return;
      }
      utils_uniUtils.toast("正在验证邀请码...", "loading");
      try {
        const response = await utils_api_togetherDrinkApi.getInvitationByCode(inputCode.value);
        let invitation = null;
        if (response && response.invitation) {
          invitation = response.invitation;
        } else if (response && response.data && response.data.invitation) {
          invitation = response.data.invitation;
        } else if (response && response.data && response.data.data && response.data.data.invitation) {
          invitation = response.data.data.invitation;
        } else if (response && response.invitationId) {
          invitation = response;
        } else if (response && response.data && response.data.invitationId) {
          invitation = response.data;
        } else if (response && response.data && response.data.data) {
          invitation = response.data.data;
        }
        if (!invitation) {
          utils_uniUtils.toast("邀请码无效或已过期", "none");
          return;
        }
        if (invitation.status) {
          if (invitation.status === "expired") {
            utils_uniUtils.toast("邀请已过期", "none");
            return;
          } else if (invitation.status === "cancelled") {
            utils_uniUtils.toast("邀请已被取消", "none");
            return;
          } else if (invitation.status === "joined" || invitation.status === "paid" || invitation.status === "completed") {
            utils_uniUtils.toast("邀请已被其他用户加入", "none");
            return;
          } else if (invitation.status !== "created" && invitation.status !== "waiting") {
            utils_uniUtils.toast(`邀请状态异常: ${invitation.status}`, "none");
            return;
          }
        }
        if (invitation.creatorId === utils_userData.userData.userId) {
          utils_uniUtils.toast("不能加入自己创建的邀请", "none");
          return;
        }
        if (invitation.invitationId) {
          invitationId.value = invitation.invitationId;
        } else if (invitation.id) {
          invitationId.value = invitation.id;
        } else {
          utils_uniUtils.toast("无法获取邀请ID", "none");
          return;
        }
        if (invitation.creatorInfo) {
          partnerInfo.value = {
            id: invitation.creatorInfo.userId,
            nickname: invitation.creatorInfo.nickname || "创建者",
            avatar: invitation.creatorInfo.avatar || "/static/images/avatar-default.png"
          };
        } else if (invitation.creatorId) {
          partnerInfo.value = {
            id: invitation.creatorId,
            nickname: invitation.creatorNickname || "创建者",
            avatar: invitation.creatorAvatar || "/static/images/avatar-default.png"
          };
        }
        if (invitation.productInfo) {
          product.value = {
            id: invitation.productInfo.productId,
            name: invitation.productInfo.productName,
            description: invitation.productInfo.description || "特选双人奶茶套餐",
            price: invitation.productInfo.productPrice,
            imageUrl: invitation.productInfo.productImage || "/static/images/default-product.png"
          };
        } else if (invitation.productId) {
          product.value = {
            id: invitation.productId,
            name: invitation.productName || product.value.name,
            description: product.value.description,
            price: invitation.productPrice || product.value.price,
            imageUrl: invitation.productImage || product.value.imageUrl
          };
        }
        const joinData = {
          userId: utils_userData.userData.userId
        };
        try {
          const joinResponse = await utils_api_togetherDrinkApi.joinInvitation(invitationId.value, joinData);
          if (joinResponse.data && joinResponse.data.code === 500) {
            utils_uniUtils.toast(joinResponse.data.message || "邀请不存在或已不可加入", "none");
            return;
          }
          if (joinResponse.data && joinResponse.data.code !== 200) {
            utils_uniUtils.toast(joinResponse.data.message || "加入邀请失败", "none");
            return;
          }
          state.value = "joined";
          saveInvitationState();
          utils_uniUtils.toast("成功加入邀请", "success");
          setTimeout(() => {
            state.value = "ready";
            saveInvitationState();
          }, 2e3);
        } catch (error) {
          utils_uniUtils.toast("加入邀请失败，请检查邀请码是否正确", "none");
        }
      } catch (error) {
        utils_uniUtils.toast("加入邀请失败，请检查邀请码是否正确", "none");
      }
    };
    const copyInviteCode = () => {
      common_vendor.index.setClipboardData({
        data: inviteCode.value,
        success: () => {
          utils_uniUtils.toast("邀请码已复制");
        }
      });
    };
    const shareInvitation = () => {
      const inviteLink = `/pages/together-drink/together-drink?code=${inviteCode.value}`;
      common_vendor.index.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"]
      });
      common_vendor.index.$emit("setShareInfo", {
        title: `来和我一起喝${product.value.name}，享受特别优惠！`,
        path: inviteLink,
        imageUrl: product.value.imageUrl,
        desc: "扫码进入小程序，输入邀请码即可参与"
      });
      utils_uniUtils.toast("请点击右上角分享", "none", 2e3);
      common_vendor.index.setClipboardData({
        data: `邀请码: ${inviteCode.value}`
      });
    };
    const cancelInvite = async () => {
      try {
        utils_uniUtils.toast("正在取消邀请...", "loading");
        if (invitationId.value) {
          await utils_api_togetherDrinkApi.cancelInvitation(invitationId.value, {
            userId: utils_userData.userData.userId
          });
        }
        state.value = "initial";
        inviteCode.value = "";
        clearInterval(countdownTimer.value);
        countdown.value = 600;
        common_vendor.index.removeStorageSync("togetherDrinkState");
        utils_uniUtils.toast("邀请已取消", "success");
      } catch (error) {
        state.value = "initial";
        inviteCode.value = "";
        clearInterval(countdownTimer.value);
        countdown.value = 600;
        utils_uniUtils.toast("邀请已取消", "success");
      }
    };
    common_vendor.onMounted(() => {
      utils_userData.initUserData();
      fetchProductInfo(1);
      initAddressInfo();
      restoreInvitationState();
      if (invitationId.value || inviteCode.value) {
        syncInvitationFromServer();
      }
      const refreshTimer = setInterval(() => {
        if (invitationId.value || inviteCode.value) {
          syncInvitationFromServer();
        }
      }, 3e4);
      refreshTimerRef.value = refreshTimer;
      isInitialized.value = true;
    });
    const refreshTimerRef = common_vendor.ref(null);
    common_vendor.onUnmounted(() => {
      if (countdownTimer.value) {
        clearInterval(countdownTimer.value);
      }
      if (refreshTimerRef.value) {
        clearInterval(refreshTimerRef.value);
      }
    });
    common_vendor.onShow(() => {
      if (isInitialized.value) {
        refreshData();
      }
    });
    common_vendor.onPullDownRefresh(() => {
      refreshData().then(() => {
        common_vendor.index.stopPullDownRefresh();
      });
    });
    const refreshData = async () => {
      try {
        common_vendor.index.showLoading({
          title: "刷新中...",
          mask: true
        });
        await syncInvitationFromServer();
        common_vendor.index.hideLoading();
        utils_uniUtils.toast("已刷新最新状态", "success", 1500);
        return Promise.resolve();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/together-drink/together-drink.vue:804", "刷新数据失败:", error);
        common_vendor.index.hideLoading();
        return Promise.reject(error);
      }
    };
    const refreshStatus = async () => {
      common_vendor.index.showLoading({
        title: "刷新中...",
        mask: true
      });
      await syncInvitationFromServer();
      common_vendor.index.hideLoading();
      utils_uniUtils.toast("已刷新最新状态", "success", 1500);
    };
    const initAddressInfo = () => {
      try {
        const storeInfo = common_vendor.index.getStorageSync("selectedStore");
        if (storeInfo) {
          const store = typeof storeInfo === "string" ? JSON.parse(storeInfo) : storeInfo;
          storeAddress.value = {
            id: store.id || "",
            name: store.name || "",
            address: store.address || "",
            distance: store.distance || ""
          };
        } else {
          storeAddress.value = {
            id: "",
            name: "",
            address: "",
            distance: ""
          };
        }
      } catch (error) {
        storeAddress.value = {
          id: "",
          name: "",
          address: "",
          distance: ""
        };
      }
      checkNetworkAndGetAddress();
    };
    const checkNetworkAndGetAddress = () => {
      common_vendor.index.getNetworkType({
        success: (res) => {
          if (res.networkType === "none") {
            tryUseLocalAddress();
          } else {
            if (deliveryType.value === "delivery") {
              getUserDefaultAddress();
            }
          }
        },
        fail: () => {
          if (deliveryType.value === "delivery") {
            getUserDefaultAddress();
          }
        }
      });
    };
    const getUserDefaultAddress = () => {
      const userId = utils_userData.userData.userId;
      if (!userId) {
        userAddress.value = {
          address: "请先登录并设置收货地址",
          name: "",
          phone: ""
        };
        return;
      }
      try {
        const cachedAddress = common_vendor.index.getStorageSync("userDefaultAddress");
        if (cachedAddress) {
          const addressObj = typeof cachedAddress === "string" ? JSON.parse(cachedAddress) : cachedAddress;
        }
      } catch (err) {
      }
      const requestUrl = `http://localhost:8082/api/user/default-address?userId=${userId}`;
      const timeout = setTimeout(() => {
        tryUseLocalAddress();
      }, 5e3);
      common_vendor.index.request({
        url: requestUrl,
        method: "GET",
        success: (res) => {
          clearTimeout(timeout);
          if (res.data && res.data.code === 200 && res.data.data && res.data.data.address) {
            const addressData = res.data.data.address;
            userAddress.value = {
              id: addressData.id || "",
              name: addressData.name || utils_userData.userData.nickname || "用户",
              phone: addressData.phone || utils_userData.userData.phone || "",
              address: addressData.address || "请设置默认收货地址"
            };
            common_vendor.index.setStorageSync(
              "userDefaultAddress",
              JSON.stringify(userAddress.value)
            );
          } else {
            if (!tryUseLocalAddress()) {
              userAddress.value = {
                address: "请设置默认收货地址",
                name: utils_userData.userData.nickname || "用户",
                phone: utils_userData.userData.phone || ""
              };
            }
          }
        },
        fail: () => {
          clearTimeout(timeout);
          if (!tryUseLocalAddress()) {
            userAddress.value = {
              address: "获取地址失败，请重试",
              name: utils_userData.userData.nickname || "用户",
              phone: utils_userData.userData.phone || ""
            };
          }
        }
      });
    };
    const tryUseLocalAddress = () => {
      try {
        const cachedAddress = common_vendor.index.getStorageSync("userDefaultAddress");
        if (cachedAddress) {
          const addressObj = typeof cachedAddress === "string" ? JSON.parse(cachedAddress) : cachedAddress;
          userAddress.value = addressObj;
          return true;
        }
      } catch (err) {
      }
      {
        userAddress.value = {
          id: "mock-address-001",
          name: utils_userData.userData.nickname || "测试用户",
          phone: "13800138000",
          address: "杭州市西湖区西溪路600号古墩路口"
        };
        return true;
      }
    };
    const selectDelivery = (type) => {
      deliveryType.value = type;
      if (type === "delivery") {
        checkNetworkAndGetAddress();
      }
    };
    const selectAddress = () => {
      if (!utils_userData.userData.userId) {
        utils_uniUtils.toast("请先登录后再选择地址", "none", 2e3);
        setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "/pages/login/login"
          });
        }, 1500);
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/address/address-list?select=true"
      });
      common_vendor.index.$once("addressSelected", (address) => {
        if (address) {
          userAddress.value = address;
        }
      });
    };
    const payOrder = async () => {
      if (!utils_userData.userData.userId) {
        utils_uniUtils.toast("请先登录后再支付", "none", 2e3);
        setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "/pages/login/login"
          });
        }, 1500);
        return;
      }
      if (deliveryType.value === "delivery" && !userAddress.value) {
        utils_uniUtils.toast("请先选择收货地址", "none");
        return;
      }
      utils_uniUtils.toast("正在处理支付...", "loading");
      try {
        let orderAddress = storeAddress.value.address;
        let deliveryInfo = {
          type: deliveryType.value,
          storeAddress: storeAddress.value.address
        };
        if (deliveryType.value === "delivery") {
          orderAddress = userAddress.value.address;
          deliveryInfo.userAddress = userAddress.value;
        }
        const orderResult = await utils_api_togetherDrinkApi.completeInvitation(invitationId.value, {
          orderAddress,
          deliveryInfo
        });
        if (orderResult && orderResult.orderId) {
          utils_uniUtils.toast("支付成功，订单已创建", "success");
          common_vendor.index.removeStorageSync("togetherDrinkState");
          setTimeout(() => {
            common_vendor.index.navigateTo({
              url: `/pages/order-detail/order-detail?id=${orderResult.orderId}`
            });
          }, 1500);
        } else {
          utils_uniUtils.toast("订单创建失败，请重试", "none");
        }
      } catch (error) {
        utils_uniUtils.toast("支付处理失败，请重试", "none");
      }
    };
    const saveInvitationState = () => {
      if (state.value === "initial") {
        common_vendor.index.removeStorageSync("togetherDrinkState");
        common_vendor.index.removeStorageSync("togetherDrinkInvite");
        return;
      }
      let safePartnerInfo = partnerInfo.value ? {
        id: partnerInfo.value.id || "unknown",
        nickname: partnerInfo.value.nickname || "好友",
        avatar: partnerInfo.value.avatar || "/static/images/avatar-default.png"
      } : null;
      const stateData = {
        state: state.value,
        inviteCode: inviteCode.value,
        invitationId: invitationId.value,
        expireTime: expireTime.value,
        // 保存绝对过期时间
        product: product.value,
        partnerInfo: safePartnerInfo,
        userInfo: {
          id: utils_userData.userData.userId,
          nickname: utils_userData.userData.nickname || "我",
          avatar: utils_userData.userData.avatar || "/static/images/avatar.png"
        },
        createTime: Date.now()
        // 记录保存时间
      };
      common_vendor.index.setStorageSync("togetherDrinkState", stateData);
    };
    const restoreInvitationState = async () => {
      try {
        const query = common_vendor.index.getLaunchOptionsSync().query || {};
        let code = query.code || "";
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        if (currentPage && currentPage.options && currentPage.options.code) {
          code = currentPage.options.code;
        }
        if (code && code.length === 8) {
          inputCode.value = code;
          setTimeout(() => {
            joinByCode();
          }, 500);
          return;
        }
        const savedState = common_vendor.index.getStorageSync("togetherDrinkState");
        if (savedState) {
          if (savedState.expireTime) {
            const now = Date.now();
            const expireTs = new Date(savedState.expireTime).getTime();
            if (now >= expireTs) {
              common_vendor.index.removeStorageSync("togetherDrinkState");
              utils_uniUtils.toast("之前的邀请已过期", "none", 1500);
              return;
            }
            const remainingMs = expireTs - now;
            countdown.value = Math.floor(remainingMs / 1e3);
            expireTime.value = savedState.expireTime;
          }
          state.value = savedState.state;
          if (state.value === "created") {
            state.value = "waiting";
          }
          inviteCode.value = savedState.inviteCode;
          invitationId.value = savedState.invitationId;
          if ((state.value === "waiting" || state.value === "created") && countdown.value > 0) {
            startCountdown();
          }
          if (savedState.product) {
            product.value = savedState.product;
          }
          if (savedState.partnerInfo) {
            partnerInfo.value = savedState.partnerInfo;
          }
          if (savedState.userInfo) {
            utils_userData.userData.userId = savedState.userInfo.id;
            utils_userData.userData.nickname = savedState.userInfo.nickname;
            utils_userData.userData.avatar = savedState.userInfo.avatar;
          }
          utils_uniUtils.toast("已恢复之前的邀请状态", "none", 1500);
          await syncInvitationFromServer(savedState);
        }
      } catch (error) {
      }
    };
    const syncInvitationFromServer = async (savedState = null) => {
      try {
        if (!invitationId.value && !inviteCode.value) {
          return;
        }
        let invitationData = null;
        try {
          if (invitationId.value) {
            const response = await utils_api_togetherDrinkApi.getInvitationById(invitationId.value);
            if (response && response.data && response.data.invitation) {
              invitationData = response.data.invitation;
            } else if (response && response.data && response.data.data && response.data.data.invitation) {
              invitationData = response.data.data.invitation;
            } else if (response && response.data && response.data.data) {
              invitationData = response.data.data;
            } else if (response && response.invitation) {
              invitationData = response.invitation;
            } else if (response && response.data) {
              invitationData = response.data;
            } else if (response && response.status === 404) {
              state.value = "initial";
              inviteCode.value = "";
              invitationId.value = "";
              common_vendor.index.removeStorageSync("togetherDrinkState");
              utils_uniUtils.toast("邀请不存在或已被删除", "none");
              return;
            }
          }
          if (!invitationData && inviteCode.value) {
            const response = await utils_api_togetherDrinkApi.getInvitationByCode(inviteCode.value);
            if (response && response.data && response.data.invitation) {
              invitationData = response.data.invitation;
            } else if (response && response.data && response.data.data && response.data.data.invitation) {
              invitationData = response.data.data.invitation;
            } else if (response && response.data && response.data.data) {
              invitationData = response.data.data;
            } else if (response && response.invitation) {
              invitationData = response.invitation;
            } else if (response && response.data) {
              invitationData = response.data;
            } else if (response && response.status === 404) {
              state.value = "initial";
              inviteCode.value = "";
              invitationId.value = "";
              common_vendor.index.removeStorageSync("togetherDrinkState");
              utils_uniUtils.toast("邀请码无效或已过期", "none");
              return;
            }
          }
          if (!invitationData) {
            if (state.value !== "initial") {
              setTimeout(() => {
                syncInvitationFromServer();
              }, 5e3);
            }
            return;
          }
          updateInvitationData(invitationData);
          await updateUsersData(invitationData);
          saveInvitationState();
        } catch (error) {
        }
      } catch (error) {
      }
    };
    const updateInvitationData = (invitationData) => {
      try {
        if (invitationData.id && !invitationId.value) {
          invitationId.value = invitationData.id;
        } else if (invitationData.invitationId && !invitationId.value) {
          invitationId.value = invitationData.invitationId;
        }
        if (invitationData.inviteCode && !inviteCode.value) {
          inviteCode.value = invitationData.inviteCode;
        }
        if (invitationData.status === "cancelled") {
          utils_uniUtils.toast("邀请已被取消", "none", 1500);
          state.value = "initial";
          inviteCode.value = "";
          invitationId.value = "";
          if (countdownTimer.value) {
            clearInterval(countdownTimer.value);
          }
          countdown.value = 600;
          common_vendor.index.removeStorageSync("togetherDrinkState");
          return;
        }
        if (invitationData.status && invitationData.status !== state.value) {
          if (invitationData.status === "created") {
            state.value = "waiting";
          } else if (invitationData.status === "joined") {
            state.value = "joined";
            const currentUserId = utils_userData.userData.userId;
            const creatorId = invitationData.creatorId;
            if (currentUserId === creatorId) {
              utils_uniUtils.toast("有好友已加入您的邀请！", "success");
            }
            setTimeout(() => {
              state.value = "ready";
              saveInvitationState();
            }, 2e3);
          } else {
            state.value = invitationData.status;
          }
        } else if (state.value === "initial" && invitationData.status === "joined") {
          state.value = "joined";
          setTimeout(() => {
            state.value = "ready";
            saveInvitationState();
          }, 1e3);
        }
        if (invitationData.productId) {
          product.value = {
            id: invitationData.productId,
            name: invitationData.productName || product.value.name,
            description: product.value.description,
            price: invitationData.productPrice || product.value.price,
            imageUrl: invitationData.productImage || product.value.imageUrl
          };
        } else if (invitationData.productInfo) {
          product.value = {
            id: invitationData.productInfo.productId,
            name: invitationData.productInfo.productName || product.value.name,
            description: product.value.description,
            price: invitationData.productInfo.productPrice || product.value.price,
            imageUrl: invitationData.productInfo.productImage || product.value.imageUrl
          };
        }
      } catch (error) {
      }
    };
    const updateUsersData = async (invitationData) => {
      const currentUserId = utils_userData.userData.userId;
      const creatorId = invitationData.creatorId;
      const participantId = invitationData.participantId;
      if ((state.value === "joined" || state.value === "ready") && participantId) {
        if (currentUserId === creatorId) {
          try {
            const response = await utils_api_userApi.getUserProfile(participantId);
            let userData2 = null;
            if (response && response.data && typeof response.data === "object") {
              userData2 = response.data;
              if (userData2.data && userData2.data.nickname) {
                partnerInfo.value = {
                  id: participantId,
                  nickname: userData2.data.nickname || "好友",
                  avatar: userData2.data.avatar || "/static/images/avatar-default.png"
                };
              } else if (userData2.nickname) {
                partnerInfo.value = {
                  id: participantId,
                  nickname: userData2.nickname || "好友",
                  avatar: userData2.avatar || "/static/images/avatar-default.png"
                };
              }
            }
          } catch (error) {
          }
        } else if (currentUserId === participantId) {
          try {
            const response = await utils_api_userApi.getUserProfile(creatorId);
            let userData2 = null;
            if (response && response.data && typeof response.data === "object") {
              userData2 = response.data;
              if (userData2.data && userData2.data.nickname) {
                partnerInfo.value = {
                  id: creatorId,
                  nickname: userData2.data.nickname || "创建者",
                  avatar: userData2.data.avatar || "/static/images/avatar-default.png"
                };
              } else if (userData2.nickname) {
                partnerInfo.value = {
                  id: creatorId,
                  nickname: userData2.nickname || "创建者",
                  avatar: userData2.avatar || "/static/images/avatar-default.png"
                };
              }
            }
          } catch (error) {
          }
        }
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: product.value.imageUrl,
        b: common_vendor.t(product.value.name),
        c: common_vendor.t(product.value.description),
        d: common_vendor.t(product.value.price),
        e: common_vendor.p({
          type: deliveryType.value === "self" ? "checkbox-filled" : "circle",
          size: "20",
          color: deliveryType.value === "self" ? "#1890ff" : "#999"
        }),
        f: deliveryType.value === "self" ? 1 : "",
        g: common_vendor.o(($event) => selectDelivery("self")),
        h: common_vendor.p({
          type: deliveryType.value === "delivery" ? "checkbox-filled" : "circle",
          size: "20",
          color: deliveryType.value === "delivery" ? "#1890ff" : "#999"
        }),
        i: deliveryType.value === "delivery" ? 1 : "",
        j: common_vendor.o(($event) => selectDelivery("delivery")),
        k: common_vendor.p({
          type: "location",
          size: "16",
          color: "#666"
        }),
        l: common_vendor.t(storeAddress.value.name),
        m: common_vendor.t(storeAddress.value.address),
        n: storeAddress.value.distance
      }, storeAddress.value.distance ? {
        o: common_vendor.t(storeAddress.value.distance)
      } : {}, {
        p: deliveryType.value === "delivery"
      }, deliveryType.value === "delivery" ? common_vendor.e({
        q: common_vendor.p({
          type: "home",
          size: "16",
          color: "#666"
        }),
        r: userAddress.value
      }, userAddress.value ? {
        s: common_vendor.t(userAddress.value.address),
        t: common_vendor.t(userAddress.value.name),
        v: common_vendor.t(userAddress.value.phone)
      } : {
        w: common_vendor.p({
          type: "right",
          size: "16",
          color: "#999"
        }),
        x: common_vendor.o(selectAddress)
      }) : {}, {
        y: userInfo.value.avatar || "/static/images/avatar.png",
        z: common_vendor.t(userInfo.value.nickname || "我"),
        A: state.value === "joined" || state.value === "ready"
      }, state.value === "joined" || state.value === "ready" ? {
        B: partnerInfo.value.avatar || "/static/images/avatar.png",
        C: common_vendor.t(partnerInfo.value.nickname || "好友")
      } : {}, {
        D: state.value === "waiting" || state.value === "initial" || state.value === "created"
      }, state.value === "waiting" || state.value === "initial" || state.value === "created" ? {
        E: common_vendor.p({
          type: "contact",
          size: "30",
          color: "#CCCCCC"
        })
      } : {}, {
        F: state.value === "initial"
      }, state.value === "initial" ? {
        G: common_vendor.o(generateInviteCode),
        H: common_vendor.o([($event) => inputCode.value = $event.detail.value, formatInviteCode]),
        I: inputCode.value,
        J: common_vendor.o(joinByCode),
        K: !inputCode.value || inputCode.value.length < 8
      } : {}, {
        L: state.value === "waiting" || state.value === "created"
      }, state.value === "waiting" || state.value === "created" ? {
        M: common_vendor.t(inviteCode.value),
        N: common_vendor.o(copyInviteCode),
        O: common_vendor.t(formatCountdown.value),
        P: common_vendor.p({
          type: "refresh",
          size: "14",
          color: "#ffffff"
        }),
        Q: common_vendor.o(refreshStatus),
        R: common_vendor.o(shareInvitation),
        S: common_vendor.o(cancelInvite)
      } : {}, {
        T: state.value === "joined"
      }, state.value === "joined" ? {
        U: common_vendor.p({
          type: "checkbox-filled",
          size: "24",
          color: "#07c160"
        }),
        V: common_vendor.t(partnerInfo.value.nickname)
      } : {}, {
        W: state.value === "ready"
      }, state.value === "ready" ? {
        X: common_vendor.t(totalPrice.value),
        Y: common_vendor.o(payOrder),
        Z: common_vendor.o(cancelInvite)
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/together-drink/together-drink.js.map
