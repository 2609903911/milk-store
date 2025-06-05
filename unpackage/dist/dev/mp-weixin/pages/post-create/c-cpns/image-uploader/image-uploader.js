"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "ImageUploader",
  props: {
    initialImages: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      images: [...this.initialImages || []],
      uploading: false
    };
  },
  methods: {
    // 选择图片
    chooseImage() {
      const that = this;
      common_vendor.index.chooseImage({
        count: 9 - this.images.length,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: function(res) {
          const tempFilePaths = res.tempFilePaths;
          const newImages = [...that.images, ...tempFilePaths];
          that.images = newImages;
          that.$emit("update:images", newImages);
        }
      });
    },
    // 删除图片
    removeImage(index) {
      this.images.splice(index, 1);
      this.$emit("update:images", [...this.images]);
    },
    // 供父组件调用，设置图片数组
    setImages(images) {
      this.images = [...images || []];
    },
    // 获取所有图片的临时路径
    getImagePaths() {
      return [...this.images];
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.images.length),
    b: common_vendor.f($data.images, (image, index, i0) => {
      return {
        a: image,
        b: common_vendor.o(($event) => $options.removeImage(index), index),
        c: index
      };
    }),
    c: $data.images.length < 9
  }, $data.images.length < 9 ? {
    d: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {}, {
    e: $data.uploading
  }, $data.uploading ? {} : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-868cde2b"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/post-create/c-cpns/image-uploader/image-uploader.js.map
