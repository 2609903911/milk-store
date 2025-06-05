// 帖子图片上传示例

import { uploadPostImages, createPost } from "../utils/api/postApi";

/**
 * 示例：选择并上传帖子图片
 */
export const handlePostImageUpload = async (userId) => {
  try {
    // 1. 选择图片
    const { tempFilePaths } = await uni.chooseImage({
      count: 9, // 最多可选择的图片数量
      sizeType: ["original", "compressed"], // 可选择原图或压缩图
      sourceType: ["album", "camera"], // 可选择性开放访问相册、相机
    });

    if (!tempFilePaths || tempFilePaths.length === 0) {
      uni.showToast({
        title: "未选择图片",
        icon: "none",
      });
      return [];
    }

    // 显示上传中提示
    uni.showLoading({
      title: "上传中...",
      mask: true,
    });

    // 2. 上传图片
    const uploadResult = await uploadPostImages({
      filePaths: tempFilePaths,
      userId: userId,
    });

    // 关闭上传提示
    uni.hideLoading();

    // 3. 处理上传结果
    if (uploadResult && uploadResult.code === 200) {
      uni.showToast({
        title: "图片上传成功",
        icon: "success",
      });

      // 返回上传成功的图片URL数组
      return uploadResult.data.imageUrls;
    } else {
      throw new Error(uploadResult?.message || "上传失败");
    }
  } catch (error) {
    uni.hideLoading();
    uni.showToast({
      title: error.message || "上传图片失败",
      icon: "none",
    });
    return [];
  }
};

/**
 * 示例：发布带图片的帖子
 */
export const publishPostWithImages = async ({
  title,
  content,
  productId,
  userId,
}) => {
  try {
    // 1. 先上传图片
    const imageUrls = await handlePostImageUpload(userId);

    // 2. 发布帖子
    if (imageUrls && imageUrls.length > 0) {
      // 将图片URL数组转为JSON字符串
      const imagesStr = JSON.stringify(imageUrls);

      // 发布帖子
      const postResult = await createPost({
        title,
        content,
        productId,
        userId,
        imagesStr,
      });

      if (postResult && postResult.code === 200) {
        uni.showToast({
          title: "发布成功",
          icon: "success",
        });

        // 发布成功后跳转到社区页面
        setTimeout(() => {
          uni.switchTab({
            url: "/pages/community/community",
          });
        }, 1500);

        return postResult.data;
      } else {
        throw new Error(postResult?.message || "发布失败");
      }
    } else {
      // 无图片，直接发布
      const postResult = await createPost({
        title,
        content,
        productId,
        userId,
      });

      if (postResult && postResult.code === 200) {
        uni.showToast({
          title: "发布成功",
          icon: "success",
        });

        // 发布成功后跳转到社区页面
        setTimeout(() => {
          uni.switchTab({
            url: "/pages/community/community",
          });
        }, 1500);

        return postResult.data;
      } else {
        throw new Error(postResult?.message || "发布失败");
      }
    }
  } catch (error) {
    uni.showToast({
      title: error.message || "发布失败",
      icon: "none",
    });
    return null;
  }
};

// 在页面中使用示例
/*
import { publishPostWithImages } from '@/examples/post-image-upload-example';

// 在表单提交时调用
const handleSubmit = async () => {
  const userId = getApp().globalData.userId || '';
  await publishPostWithImages({
    title: this.title,
    content: this.content,
    productId: this.productId,
    userId: userId
  });
};
*/
