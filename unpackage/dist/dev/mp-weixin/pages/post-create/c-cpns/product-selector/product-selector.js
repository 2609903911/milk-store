"use strict";
const common_vendor = require("../../../../common/vendor.js");
const utils_api_productApi = require("../../../../utils/api/productApi.js");
const _sfc_main = {
  name: "ProductSelector",
  props: {
    initialProductId: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      productList: [],
      selectedProduct: null,
      searchKeyword: "",
      loading: false,
      allProducts: [],
      debounceTimer: null
    };
  },
  created() {
    this.getProducts();
    if (this.initialProductId) {
      setTimeout(() => {
        this.loadProductById(this.initialProductId);
      }, 500);
    }
  },
  methods: {
    // 获取产品列表
    async getProducts() {
      this.loading = true;
      try {
        const response = await utils_api_productApi.fetchProducts();
        if (response) {
          if (Array.isArray(response)) {
            this.productList = response;
            this.allProducts = [...response];
          } else if (response.data && Array.isArray(response.data)) {
            this.productList = response.data;
            this.allProducts = [...response.data];
          } else if (typeof response === "object" && response.id) {
            this.productList = [response];
            this.allProducts = [response];
          } else {
            if (typeof response === "object") {
            }
          }
        } else {
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "获取产品列表失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    // 清除搜索
    clearSearch() {
      this.searchKeyword = "";
      this.productList = [...this.allProducts];
    },
    // 高亮关键词
    highlightKeyword(text, keyword) {
      if (!text || !keyword)
        return text;
      try {
        const keywordLower = keyword.toLowerCase().trim();
        if (!keywordLower)
          return text;
        return text;
      } catch (error) {
        return text;
      }
    },
    // 搜索产品
    async searchProducts() {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(async () => {
        if (!this.searchKeyword.trim()) {
          this.productList = [...this.allProducts];
          return;
        }
        this.loading = true;
        const keyword = this.searchKeyword.toLowerCase().trim();
        const localResults = this.allProducts.filter(
          (product) => product.name && product.name.toLowerCase().includes(keyword)
        );
        if (localResults.length > 0) {
          this.productList = localResults;
          this.loading = false;
          return;
        }
        try {
          const response = await utils_api_productApi.searchProductsByName(this.searchKeyword);
          if (response && Array.isArray(response)) {
            this.productList = response;
          } else if (response && response.data && Array.isArray(response.data)) {
            this.productList = response.data;
          } else {
            this.productList = [];
          }
        } catch (error) {
          common_vendor.index.showToast({
            title: "搜索产品失败",
            icon: "none"
          });
          this.productList = [];
        } finally {
          this.loading = false;
        }
      }, 300);
    },
    // 打开产品选择弹窗
    openProductSelector() {
      this.$refs.productPopup.open();
    },
    // 关闭弹窗
    closePopup() {
      this.$refs.productPopup.close();
    },
    // 选择产品
    selectProduct(product) {
      if (!product || !product.id) {
        return;
      }
      try {
        this.selectedProduct = {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          description: product.description
        };
        this.$emit("update:productId", product.id);
        this.closePopup();
      } catch (error) {
      }
    },
    // 移除已选产品
    removeProduct() {
      this.selectedProduct = null;
      this.$emit("update:productId", null);
    },
    // 根据产品ID加载产品信息
    async loadProductById(productId) {
      if (!productId)
        return;
      this.loading = true;
      try {
        let product = null;
        try {
          product = this.productList.find(
            (p) => String(p.id) === String(productId)
          );
        } catch (findError) {
        }
        if (!product) {
          try {
            const response = await utils_api_productApi.fetchProductById(productId);
            if (response) {
              if (response.id) {
                product = response;
              } else if (response.data && response.data.id) {
                product = response.data;
              } else {
              }
            }
          } catch (apiError) {
            try {
              await this.getProducts();
              if (this.productList && this.productList.length > 0) {
                product = this.productList.find(
                  (p) => String(p.id) === String(productId)
                );
              }
            } catch (listError) {
            }
          }
        }
        if (product) {
          this.selectedProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            description: product.description
          };
        } else {
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    // 供父组件调用，设置产品ID
    setProductId(productId) {
      if (productId) {
        this.loadProductById(productId);
      } else {
        this.selectedProduct = null;
      }
    },
    // 获取高亮部分
    getHighlightParts(text, keyword) {
      if (!text || !keyword || !keyword.trim()) {
        return [{ text, highlight: false }];
      }
      try {
        const keywordLower = keyword.toLowerCase().trim();
        const textLower = text.toLowerCase();
        const parts = [];
        let lastIndex = 0;
        let index = textLower.indexOf(keywordLower);
        while (index !== -1) {
          if (index > lastIndex) {
            parts.push({
              text: text.substring(lastIndex, index),
              highlight: false
            });
          }
          parts.push({
            text: text.substring(index, index + keywordLower.length),
            highlight: true
          });
          lastIndex = index + keywordLower.length;
          index = textLower.indexOf(keywordLower, lastIndex);
        }
        if (lastIndex < text.length) {
          parts.push({
            text: text.substring(lastIndex),
            highlight: false
          });
        }
        return parts;
      } catch (error) {
        return [{ text, highlight: false }];
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.selectedProduct
  }, $data.selectedProduct ? {
    b: $data.selectedProduct.imageUrl || "/static/images/hot01.png",
    c: common_vendor.t($data.selectedProduct.name),
    d: common_vendor.t($data.selectedProduct.price),
    e: common_vendor.o((...args) => $options.removeProduct && $options.removeProduct(...args))
  } : {}, {
    f: !$data.selectedProduct
  }, !$data.selectedProduct ? {
    g: common_vendor.p({
      type: "arrowright",
      size: "20",
      color: "#999"
    }),
    h: common_vendor.o((...args) => $options.openProductSelector && $options.openProductSelector(...args))
  } : {}, {
    i: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args)),
    j: common_vendor.o([($event) => $data.searchKeyword = $event.detail.value, (...args) => $options.searchProducts && $options.searchProducts(...args)]),
    k: $data.searchKeyword,
    l: $data.searchKeyword
  }, $data.searchKeyword ? {
    m: common_vendor.o((...args) => $options.clearSearch && $options.clearSearch(...args))
  } : {}, {
    n: $data.loading
  }, $data.loading ? {} : common_vendor.e({
    o: common_vendor.f($data.productList, (product, k0, i0) => {
      return common_vendor.e({
        a: product.imageUrl || "/static/images/hot01.png",
        b: $data.searchKeyword && product.name
      }, $data.searchKeyword && product.name ? {
        c: common_vendor.f($options.getHighlightParts(product.name, $data.searchKeyword), (part, idx, i1) => {
          return {
            a: common_vendor.t(part.text),
            b: part.highlight ? 1 : "",
            c: idx
          };
        })
      } : {
        d: common_vendor.t(product.name)
      }, {
        e: common_vendor.t(product.price),
        f: product.id,
        g: common_vendor.o(($event) => $options.selectProduct(product), product.id)
      });
    }),
    p: $data.productList.length === 0
  }, $data.productList.length === 0 ? {
    q: common_vendor.t($data.searchKeyword ? "未找到相关产品" : "暂无产品数据")
  } : {}), {
    r: common_vendor.sr("productPopup", "9a9cfd93-1"),
    s: common_vendor.p({
      type: "bottom"
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9a9cfd93"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/post-create/c-cpns/product-selector/product-selector.js.map
