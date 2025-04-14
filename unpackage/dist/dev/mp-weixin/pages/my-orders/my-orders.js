"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_userState = require("../../utils/userState.js");
const utils_api_orderApi = require("../../utils/api/orderApi.js");
const _sfc_main = {
  __name: "my-orders",
  setup(__props, { expose: __expose }) {
    common_vendor.index.__f__("log", "at pages/my-orders/my-orders.vue:117", utils_userState.userState);
    const hasOrders = common_vendor.ref(false);
    const orders = common_vendor.ref([]);
    const refreshOrders = async () => {
      try {
        const userOrders = await utils_api_orderApi.fetchUserOrders();
        let totalCoinsToAdd = 0;
        userOrders.forEach((order) => {
          var _a;
          if (order.status !== "cancelled" && !order.pandaCoins) {
            const coinsForOrder = getPandaCoins(
              order.totalPrice,
              ((_a = order.discount) == null ? void 0 : _a.amount) || 0
            );
            order.pandaCoins = coinsForOrder;
            totalCoinsToAdd += coinsForOrder;
          }
        });
        if (totalCoinsToAdd > 0) {
          utils_userState.userState.pandaCoins += totalCoinsToAdd;
          utils_userState.updateUserState({ pandaCoins: utils_userState.userState.pandaCoins });
          common_vendor.index.setStorageSync("savedOrders", userOrders);
          common_vendor.index.__f__(
            "log",
            "at pages/my-orders/my-orders.vue:160",
            `已添加${totalCoinsToAdd}熊猫币，当前总数：${utils_userState.userState.pandaCoins}`
          );
        }
        orders.value = userOrders;
        hasOrders.value = userOrders.length > 0;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/my-orders/my-orders.vue:168", "获取订单列表失败:", error);
        common_vendor.index.showToast({
          title: "获取订单失败",
          icon: "none"
        });
        orders.value = [];
        hasOrders.value = false;
      }
    };
    common_vendor.onMounted(() => {
      refreshOrders();
    });
    __expose({
      onShow() {
        refreshOrders();
      }
    });
    const goToOrder = () => {
      common_vendor.index.switchTab({
        url: "/pages/order/order"
      });
    };
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes().toString().padStart(2, "0");
      return `${month}月${day}日 ${hour}:${minute}`;
    };
    const getStatusText = (status) => {
      const statusMap = {
        pending: "待取餐",
        completed: "已完成",
        cancelled: "已取消"
      };
      return statusMap[status] || "未知状态";
    };
    const getTotalQuantity = (order) => {
      return order.items.reduce((total, item) => total + item.quantity, 0);
    };
    const getPandaCoins = (price, discount = 0) => {
      const originalPrice = Number(price) + Number(discount);
      return Math.ceil(originalPrice);
    };
    const reorder = (order) => {
      var _a;
      const orderData = {
        items: order.items,
        totalPrice: order.totalPrice,
        store: {
          name: order.storeName
          // 其他门店信息可以在实际应用中补充
        },
        deliveryType: order.deliveryType,
        // 计算将要获得的熊猫币数量
        pandaCoins: getPandaCoins(order.totalPrice, ((_a = order.discount) == null ? void 0 : _a.amount) || 0)
      };
      common_vendor.index.setStorageSync("orderConfirmData", orderData);
      common_vendor.index.navigateTo({
        url: "/pages/order-confirm/order-confirm?fromReorder=true"
      });
    };
    const viewOrderDetail = (order) => {
      var _a;
      common_vendor.index.__f__("log", "at pages/my-orders/my-orders.vue:257", "查看订单详情:", order.id);
      if (!order.pandaCoins && order.status !== "cancelled") {
        const coinsToAdd = getPandaCoins(
          order.totalPrice,
          ((_a = order.discount) == null ? void 0 : _a.amount) || 0
        );
        order.pandaCoins = coinsToAdd;
        utils_userState.userState.pandaCoins += coinsToAdd;
        common_vendor.index.setStorageSync("savedOrders", orders.value);
        utils_userState.updateUserState({ pandaCoins: utils_userState.userState.pandaCoins });
        common_vendor.index.__f__(
          "log",
          "at pages/my-orders/my-orders.vue:279",
          `已添加${coinsToAdd}熊猫币，当前总数：${utils_userState.userState.pandaCoins}`
        );
      }
      common_vendor.index.setStorageSync("currentOrderDetail", order);
      common_vendor.index.navigateTo({
        url: `/pages/order-detail/order-detail?orderId=${order.id}`
      });
    };
    const cancelOrder = async (index) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要取消订单吗？",
        success: async function(res) {
          if (res.confirm) {
            try {
              const orderId = orders.value[index].id;
              const updatedOrder = await utils_api_orderApi.cancelOrder(orderId);
              orders.value[index] = updatedOrder;
              if (updatedOrder.pandaCoins) {
                utils_userState.userState.pandaCoins -= updatedOrder.pandaCoins;
                utils_userState.updateUserState({ pandaCoins: utils_userState.userState.pandaCoins });
              }
              common_vendor.index.showToast({
                title: "订单已取消",
                icon: "success"
              });
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/my-orders/my-orders.vue:323", "取消订单失败:", error);
              common_vendor.index.showToast({
                title: "取消订单失败",
                icon: "none"
              });
            }
          }
        }
      });
    };
    const deleteOrder = (index) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除此订单吗？",
        success: function(res) {
          if (res.confirm) {
            orders.value[index];
            orders.value.splice(index, 1);
            common_vendor.index.setStorageSync("savedOrders", orders.value);
            if (orders.value.length === 0) {
              hasOrders.value = false;
            }
            common_vendor.index.showToast({
              title: "订单已删除",
              icon: "success"
            });
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !hasOrders.value
      }, !hasOrders.value ? {
        b: common_assets._imports_0$3,
        c: common_vendor.o(goToOrder)
      } : {}, {
        d: hasOrders.value
      }, hasOrders.value ? {
        e: common_vendor.f(orders.value, (order, index, i0) => {
          var _a;
          return common_vendor.e({
            a: common_vendor.t(order.deliveryType === "self" ? "自取" : "外卖"),
            b: common_vendor.t(order.storeName),
            c: common_vendor.t(getStatusText(order.status)),
            d: order.items[0].image,
            e: common_vendor.t(order.items[0].name),
            f: order.items.length > 1
          }, order.items.length > 1 ? {
            g: common_vendor.t(order.items.length)
          } : {}, {
            h: common_vendor.t(formatTime(order.time)),
            i: order.discount && order.discount.amount > 0
          }, order.discount && order.discount.amount > 0 ? {
            j: common_vendor.t(order.discount.amount)
          } : {}, {
            k: order.status !== "cancelled"
          }, order.status !== "cancelled" ? {
            l: common_vendor.t(order.pandaCoins || getPandaCoins(order.totalPrice, ((_a = order.discount) == null ? void 0 : _a.amount) || 0))
          } : {}, {
            m: common_vendor.t(order.totalPrice),
            n: common_vendor.t(getTotalQuantity(order)),
            o: order.discount && order.discount.amount > 0
          }, order.discount && order.discount.amount > 0 ? {
            p: common_vendor.t(order.discount.originalPrice)
          } : {}, {
            q: common_vendor.o(($event) => viewOrderDetail(order), index),
            r: order.status === "completed"
          }, order.status === "completed" ? {
            s: common_vendor.o(($event) => reorder(order), index)
          } : {}, {
            t: order.status === "pending"
          }, order.status === "pending" ? {
            v: common_vendor.o(($event) => cancelOrder(index), index)
          } : {}, {
            w: common_vendor.o(($event) => deleteOrder(index), index),
            x: index
          });
        })
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my-orders/my-orders.js.map
