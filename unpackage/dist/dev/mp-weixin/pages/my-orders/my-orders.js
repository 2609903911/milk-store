"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "my-orders",
  setup(__props) {
    const hasOrders = common_vendor.ref(false);
    const orders = common_vendor.ref([]);
    common_vendor.onMounted(() => {
      const savedOrders = common_vendor.index.getStorageSync("savedOrders");
      if (savedOrders && savedOrders.length) {
        orders.value = savedOrders;
        hasOrders.value = true;
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
    const reorder = (order) => {
      const orderData = {
        items: order.items,
        totalPrice: order.totalPrice,
        store: {
          name: order.storeName
          // 其他门店信息可以在实际应用中补充
        },
        deliveryType: order.deliveryType
      };
      common_vendor.index.setStorageSync("orderConfirmData", orderData);
      common_vendor.index.navigateTo({
        url: "/pages/order-confirm/order-confirm"
      });
    };
    const viewOrderDetail = (order) => {
      common_vendor.index.__f__("log", "at pages/my-orders/my-orders.vue:173", "查看订单详情:", order.id);
      common_vendor.index.setStorageSync("currentOrderDetail", order);
      common_vendor.index.navigateTo({
        url: `/pages/order-detail/order-detail?orderId=${order.id}`
      });
    };
    const cancelOrder = (index) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要取消订单吗？",
        success: function(res) {
          if (res.confirm) {
            orders.value[index].status = "cancelled";
            common_vendor.index.setStorageSync("savedOrders", orders.value);
            common_vendor.index.showToast({
              title: "订单已取消",
              icon: "success"
            });
          }
        }
      });
    };
    const deleteOrder = (index) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这条订单记录吗？",
        success: function(res) {
          if (res.confirm) {
            orders.value.splice(index, 1);
            if (orders.value.length === 0) {
              hasOrders.value = false;
            }
            common_vendor.index.setStorageSync("savedOrders", orders.value);
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
        b: common_assets._imports_0$2,
        c: common_vendor.o(goToOrder)
      } : {}, {
        d: hasOrders.value
      }, hasOrders.value ? {
        e: common_vendor.f(orders.value, (order, index, i0) => {
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
            k: common_vendor.t(order.totalPrice),
            l: common_vendor.t(getTotalQuantity(order)),
            m: order.discount && order.discount.amount > 0
          }, order.discount && order.discount.amount > 0 ? {
            n: common_vendor.t(order.discount.originalPrice)
          } : {}, {
            o: common_vendor.o(($event) => viewOrderDetail(order), index),
            p: order.status === "completed"
          }, order.status === "completed" ? {
            q: common_vendor.o(($event) => reorder(order), index)
          } : {}, {
            r: order.status === "pending"
          }, order.status === "pending" ? {
            s: common_vendor.o(($event) => cancelOrder(index), index)
          } : {}, {
            t: common_vendor.o(($event) => deleteOrder(index), index),
            v: index
          });
        })
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my-orders/my-orders.js.map
