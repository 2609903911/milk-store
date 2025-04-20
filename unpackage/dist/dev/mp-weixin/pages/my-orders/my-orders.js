"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_userState = require("../../utils/userState.js");
const utils_api_orderApi = require("../../utils/api/orderApi.js");
const _sfc_main = {
  __name: "my-orders",
  setup(__props) {
    const hasOrders = common_vendor.ref(false);
    const orders = common_vendor.ref([]);
    const parseOrderItems = (order) => {
      if (!order || !order.orderItems)
        return [];
      try {
        const items = typeof order.orderItems === "string" ? JSON.parse(order.orderItems) : order.orderItems;
        return items;
      } catch (error) {
        return [];
      }
    };
    const getOrderFirstItemImage = (order) => {
      const items = parseOrderItems(order);
      const imageUrl = items.length > 0 && items[0].image ? items[0].image : "/static/images/default-product.png";
      return imageUrl;
    };
    const getOrderFirstItemName = (order) => {
      const items = parseOrderItems(order);
      const name = items.length > 0 && items[0].name ? items[0].name : "未知商品";
      return name;
    };
    const getOrderItemsCount = (order) => {
      const items = parseOrderItems(order);
      return items.length;
    };
    const refreshOrders = async () => {
      try {
        const userId = utils_userState.userState.userId;
        if (!userId) {
          hasOrders.value = false;
          orders.value = [];
          return;
        }
        const userOrders = await utils_api_orderApi.fetchUserOrders(userId);
        if (userOrders && userOrders.length > 0) {
          orders.value = userOrders;
          hasOrders.value = true;
        } else {
          orders.value = [];
          hasOrders.value = false;
        }
      } catch (error) {
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
    common_vendor.onShow(() => {
      const needRefresh = common_vendor.index.getStorageSync("ordersNeedRefresh");
      if (needRefresh) {
        common_vendor.index.removeStorageSync("ordersNeedRefresh");
      }
      refreshOrders();
    });
    const goToOrder = () => {
      common_vendor.index.switchTab({
        url: "/pages/order/order"
      });
    };
    const formatTime = (timestamp) => {
      if (!timestamp)
        return "未知时间";
      const date = new Date(timestamp);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes().toString().padStart(2, "0");
      return `${month}月${day}日 ${hour}:${minute}`;
    };
    const getStatusText = (status) => {
      const statusMap = {
        pending: "待支付",
        paid: "待取餐",
        completed: "已完成",
        cancelled: "已取消",
        refunded: "已退款"
      };
      return statusMap[status] || "未知状态";
    };
    const getTotalQuantity = (order) => {
      if (!order.orderItems)
        return 0;
      try {
        const items = typeof order.orderItems === "string" ? JSON.parse(order.orderItems) : order.orderItems;
        return items.reduce((total, item) => total + (item.quantity || 1), 0);
      } catch (error) {
        return 0;
      }
    };
    const getPandaCoins = (price, discount = 0) => {
      const originalPrice = Number(price) + Number(discount);
      return Math.ceil(originalPrice);
    };
    const reorder = (order) => {
      let orderItems;
      try {
        orderItems = typeof order.orderItems === "string" ? JSON.parse(order.orderItems) : order.orderItems;
      } catch (error) {
        common_vendor.index.showToast({
          title: "重新下单失败",
          icon: "none"
        });
        return;
      }
      const orderData = {
        items: orderItems,
        totalPrice: order.totalAmount,
        store: {
          name: order.storeName,
          address: order.storeAddress
        },
        deliveryType: order.deliveryType,
        // 计算将要获得的熊猫币数量
        pandaCoins: getPandaCoins(order.totalAmount, order.discountAmount || 0)
      };
      common_vendor.index.setStorageSync("orderConfirmData", orderData);
      common_vendor.index.navigateTo({
        url: "/pages/order-confirm/order-confirm?fromReorder=true"
      });
    };
    const viewOrderDetail = async (order) => {
      try {
        const orderId = order.orderId;
        const orderDetail = await utils_api_orderApi.fetchOrderById(orderId);
        common_vendor.index.setStorageSync("currentOrderDetail", orderDetail);
        common_vendor.index.navigateTo({
          url: `/pages/order-detail/order-detail?orderId=${orderId}`
        });
      } catch (error) {
        common_vendor.index.showToast({
          title: "获取订单详情失败",
          icon: "none"
        });
      }
    };
    const cancelOrder = async (index) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要取消订单吗？",
        success: async function(res) {
          if (res.confirm) {
            try {
              const orderId = orders.value[index].orderId;
              const result = await utils_api_orderApi.cancelOrder(orderId);
              if (result) {
                await refreshOrders();
                common_vendor.index.showToast({
                  title: "订单已取消",
                  icon: "success"
                });
              }
            } catch (error) {
              common_vendor.index.showToast({
                title: "取消订单失败",
                icon: "none"
              });
            }
          }
        }
      });
    };
    const deleteOrder = async (index) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除此订单吗？",
        success: async function(res) {
          if (res.confirm) {
            try {
              const orderId = orders.value[index].orderId;
              const result = await utils_api_orderApi.deleteOrder(orderId);
              orders.value.splice(index, 1);
              if (orders.value.length === 0) {
                hasOrders.value = false;
              }
              common_vendor.index.showToast({
                title: "订单已删除",
                icon: "success",
                duration: 2e3
              });
            } catch (error) {
              common_vendor.index.showToast({
                title: "删除订单失败",
                icon: "none",
                duration: 2e3
              });
            }
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
          return common_vendor.e({
            a: common_vendor.t(order.deliveryType === "self" ? "自取" : "外卖"),
            b: common_vendor.t(order.storeName),
            c: common_vendor.t(getStatusText(order.orderStatus)),
            d: getOrderFirstItemImage(order),
            e: common_vendor.t(getOrderFirstItemName(order)),
            f: getOrderItemsCount(order) > 1
          }, getOrderItemsCount(order) > 1 ? {
            g: common_vendor.t(getOrderItemsCount(order))
          } : {}, {
            h: common_vendor.t(formatTime(order.createTime)),
            i: order.discountAmount && Number(order.discountAmount) > 0
          }, order.discountAmount && Number(order.discountAmount) > 0 ? {
            j: common_vendor.t(order.discountAmount)
          } : {}, {
            k: order.orderStatus !== "cancelled"
          }, order.orderStatus !== "cancelled" ? {
            l: common_vendor.t(getPandaCoins(order.totalAmount || 0))
          } : {}, {
            m: common_vendor.t(order.actualAmount),
            n: common_vendor.t(getTotalQuantity(order)),
            o: order.discountAmount && Number(order.discountAmount) > 0
          }, order.discountAmount && Number(order.discountAmount) > 0 ? {
            p: common_vendor.t(Number(order.totalAmount))
          } : {}, {
            q: common_vendor.o(($event) => viewOrderDetail(order), index),
            r: order.orderStatus === "completed"
          }, order.orderStatus === "completed" ? {
            s: common_vendor.o(($event) => reorder(order), index)
          } : {}, {
            t: order.orderStatus === "pending"
          }, order.orderStatus === "pending" ? {
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
