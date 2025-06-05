// 帖子相关API服务

import { get, post, put, del } from "./request";

/**
 * 获取帖子列表
 * @param {Object} params 查询参数
 * @param {Number} params.page 页码
 * @param {Number} params.size 每页大小
 * @param {String} params.sortBy 排序字段
 * @returns {Promise} 帖子列表数据
 */
export const fetchPosts = async (params = {}) => {
  try {
    const response = await get("/api/posts", params);
    return response || [];
  } catch (error) {
    throw error;
  }
};

/**
 * 获取帖子详情
 * @param {String|Number} postId 帖子ID
 * @returns {Promise} 帖子详情数据
 */
export const fetchPostById = async (postId) => {
  try {
    if (!postId && postId !== 0) {
      throw new Error("帖子ID不能为空");
    }

    const response = await get(`/api/posts/${postId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * 发布帖子
 * @param {Object} data 帖子数据
 * @param {String} data.title 帖子标题
 * @param {String} data.content 帖子内容
 * @param {String|Number} data.productId 相关产品ID（必需）
 * @param {String|Number} data.userId 用户ID（必需）
 * @param {Array} data.images 帖子图片URL列表
 * @param {String} data.imagesStr 帖子图片URL字符串（多个URL用"||"分隔）
 * @returns {Promise} 创建的帖子数据
 */
export const createPost = async (data) => {
  try {
    // 验证必需的用户ID
    if (!data.userId && data.userId !== 0) {
      throw new Error("用户ID不能为空");
    }

    // 验证必需的产品ID
    if (!data.productId && data.productId !== 0) {
      throw new Error("产品ID不能为空");
    }

    // 确保userId和productId是字符串类型
    const postData = { ...data };
    postData.userId = String(postData.userId);
    postData.productId = String(postData.productId);

    // 确保必填字段存在
    if (!postData.title) throw new Error("帖子标题不能为空");
    if (!postData.content) throw new Error("帖子内容不能为空");

    // 如果提供了images数组但没有imagesStr，则从images数组创建imagesStr
    if (
      postData.images &&
      Array.isArray(postData.images) &&
      postData.images.length > 0 &&
      !postData.imagesStr
    ) {
      postData.imagesStr = postData.images.join("||");
    }

    // 如果提供了imagesStr但没有images数组，则从imagesStr创建images数组
    if (
      postData.imagesStr &&
      (!postData.images ||
        !Array.isArray(postData.images) ||
        postData.images.length === 0)
    ) {
      postData.images = postData.imagesStr
        .split("||")
        .filter((url) => url && url.trim() !== "");
    }

    // 尝试两种方式发送请求
    try {
      // 方式1：将userId作为URL参数
      const response = await post(`/api/posts?userId=${postData.userId}`, {
        title: postData.title,
        content: postData.content,
        productId: postData.productId,
        images: postData.images,
        imagesStr: postData.imagesStr,
      });
      return response;
    } catch (error1) {
      // 方式2：将userId放在请求体中
      const response = await post("/api/posts", postData);
      return response;
    }
  } catch (error) {
    throw error;
  }
};

/**
 * 更新帖子
 * @param {String|Number} postId 帖子ID
 * @param {Object} data 更新数据
 * @param {String} data.title 帖子标题
 * @param {String} data.content 帖子内容
 * @param {Array} data.images 帖子图片数组
 * @returns {Promise} 更新后的帖子数据
 */
export const updatePost = async (postId, data) => {
  try {
    if (!postId && postId !== 0) {
      throw new Error("帖子ID不能为空");
    }

    const response = await put(`/api/posts/${postId}`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * 删除帖子
 * @param {String|Number} postId 帖子ID
 * @returns {Promise} 删除结果
 */
export const deletePost = async (postId) => {
  try {
    if (!postId && postId !== 0) {
      throw new Error("帖子ID不能为空");
    }

    const response = await del(`/api/posts/${postId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * 获取用户发布的帖子
 * @param {String|Number} userId 用户ID
 * @param {Object} params 查询参数
 * @param {Number} params.page 页码
 * @param {Number} params.size 每页大小
 * @returns {Promise} 用户帖子列表
 */
export const fetchUserPosts = async (userId, params = {}) => {
  try {
    if (!userId && userId !== 0) {
      throw new Error("用户ID不能为空");
    }

    const response = await get(`/api/posts/users/${userId}/posts`, params);
    return response || [];
  } catch (error) {
    throw error;
  }
};

/**
 * 获取商品相关帖子
 * @param {String|Number} productId 商品ID
 * @param {Object} params 查询参数
 * @param {Number} params.page 页码
 * @param {Number} params.size 每页大小
 * @returns {Promise} 商品相关帖子列表
 */
export const fetchProductPosts = async (productId, params = {}) => {
  try {
    if (!productId && productId !== 0) {
      throw new Error("商品ID不能为空");
    }

    const response = await get(`/api/posts/product/${productId}`, params);
    return response || [];
  } catch (error) {
    throw error;
  }
};

/**
 * 获取帖子评论列表
 * @param {String|Number} postId 帖子ID
 * @param {Object} params 查询参数
 * @param {Number} params.page 页码
 * @param {Number} params.size 每页数量
 * @returns {Promise} 评论列表数据
 */
export const fetchPostComments = async (postId, params = {}) => {
  try {
    if (!postId && postId !== 0) {
      throw new Error("帖子ID不能为空");
    }

    const response = await get(`/api/posts/${postId}/comments`, params);
    return response || [];
  } catch (error) {
    throw error;
  }
};

/**
 * 发表评论
 * @param {Object} data 评论数据
 * @param {String|Number} data.postId 帖子ID
 * @param {String} data.content 评论内容
 * @param {String|Number} data.parentId 父评论ID（回复评论时使用）
 * @param {String|Number} data.replyToUserId 被回复用户ID（回复评论时使用）
 * @returns {Promise} 创建的评论数据
 */
export const createComment = async (data) => {
  try {
    if (!data.postId && data.postId !== 0) {
      throw new Error("帖子ID不能为空");
    }

    if (!data.content || data.content.trim() === "") {
      throw new Error("评论内容不能为空");
    }

    const response = await post("/api/comments", data);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * 删除评论
 * @param {String|Number} commentId 评论ID
 * @returns {Promise} 删除结果
 */
export const deleteComment = async (commentId) => {
  try {
    if (!commentId && commentId !== 0) {
      throw new Error("评论ID不能为空");
    }

    const response = await del(`/api/comments/${commentId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * 点赞/取消点赞
 * @param {String} targetId 目标ID（帖子ID如"post_1001"或评论ID如"comment_1001"）
 * @param {Number} targetType 目标类型（1-帖子，2-评论）
 * @param {String} userId 用户ID（必需）
 * @returns {Promise} 点赞结果
 */
export const likeOrUnlike = async (targetId, targetType, userId) => {
  try {
    if (!targetId) {
      throw new Error("目标ID不能为空");
    }

    if (targetType !== 1 && targetType !== 2) {
      throw new Error("目标类型必须为1(帖子)或2(评论)");
    }

    if (!userId) {
      throw new Error("用户ID不能为空");
    }

    const response = await post(
      `/api/${targetType}/${targetId}/like?userId=${userId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * 获取用户点赞的帖子
 * @param {String} userId 用户ID
 * @param {Object} params 查询参数
 * @param {Number} params.page 页码
 * @param {Number} params.size 每页数量
 * @returns {Promise} 用户点赞的帖子列表
 */
export const fetchUserLikedPosts = async (userId, params = {}) => {
  try {
    if (!userId) {
      throw new Error("用户ID不能为空");
    }

    const response = await get(`/api/users/${userId}/liked-posts`, params);
    return response || { code: 0, data: { posts: [] } };
  } catch (error) {
    throw error;
  }
};

/**
 * 检查用户是否点赞
 * @param {Object} params 查询参数
 * @param {String} params.userId 用户ID（必填）
 * @param {String} params.targetId 目标ID（帖子ID或评论ID，必填）
 * @param {Number} params.targetType 目标类型（1-帖子，2-评论，必填）
 * @returns {Promise} 检查结果，data.liked表示是否已点赞
 */
export const checkUserLike = async (params = {}) => {
  try {
    if (!params.targetId) {
      throw new Error("目标ID不能为空");
    }

    if (params.targetType !== 1 && params.targetType !== 2) {
      throw new Error("目标类型必须为1(帖子)或2(评论)");
    }

    if (!params.userId) {
      throw new Error("用户ID不能为空");
    }

    const response = await get("/api/users/check-like", params);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * 批量检查点赞状态
 * @param {String} userId 用户ID（必填）
 * @param {Object} data 请求数据
 * @param {Array<String>} data.targetIds 目标ID数组
 * @param {Number} data.targetType 目标类型（1-帖子，2-评论）
 * @returns {Promise} 批量检查结果，返回Map结构，key为目标ID，value为是否点赞
 */
export const batchCheckUserLike = async (userId, data) => {
  try {
    if (!userId) {
      throw new Error("用户ID不能为空");
    }

    if (
      !data.targetIds ||
      !Array.isArray(data.targetIds) ||
      data.targetIds.length === 0
    ) {
      throw new Error("目标ID数组不能为空");
    }

    if (data.targetType !== 1 && data.targetType !== 2) {
      throw new Error("目标类型必须为1(帖子)或2(评论)");
    }

    const response = await post(
      `/api/users/batch-check-like?userId=${userId}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * 上传帖子图片
 * @param {Object} options 上传选项
 * @param {Array<String>} options.filePaths 本地文件路径数组
 * @param {String} options.userId 用户ID（可选）
 * @param {String|Number} options.postId 帖子ID（可选，关联到特定帖子）
 * @param {Function} options.onProgress 上传进度回调函数（可选）
 * @returns {Promise} 上传结果，包含图片URL数组
 */
export const uploadPostImages = async (options = {}) => {
  try {
    if (
      !options.filePaths ||
      !Array.isArray(options.filePaths) ||
      options.filePaths.length === 0
    ) {
      throw new Error("文件路径数组不能为空");
    }

    // 导入BASE_URL以构建完整URL
    const { BASE_URL, getFullUrl } = require("./config");
    const fullUploadUrl = BASE_URL + "/api/upload/post/images";

    // 收集所有上传的图片URL
    let allImageUrls = [];

    for (const filePath of options.filePaths) {
      try {
        const result = await new Promise((resolve, reject) => {
          // 构建表单数据
          const formData = {
            returnFullUrl: "true", // 请求后端返回完整URL
            baseUrl: BASE_URL, // 提供基础URL给后端
          };

          if (options.userId) formData.userId = options.userId;
          if (options.postId) formData.postId = options.postId;

          uni.uploadFile({
            url: fullUploadUrl,
            filePath: filePath,
            name: "files", // 与后端接口参数名对应
            header: {
              "content-type": "multipart/form-data",
            },
            formData,
            success: (res) => {
              if (res.statusCode === 200) {
                try {
                  // 解析返回的JSON字符串
                  const data =
                    typeof res.data === "string"
                      ? JSON.parse(res.data)
                      : res.data;
                  resolve(data);
                } catch (error) {
                  reject(new Error("解析响应数据失败"));
                }
              } else {
                reject({
                  statusCode: res.statusCode,
                  message: "上传失败",
                  data: res.data,
                });
              }
            },
            fail: (err) => {
              reject({
                statusCode: -1,
                message: err.errMsg || "网络异常",
                error: err,
              });
            },
          });
        });

        // 收集上传的图片URL
        if (result && result.code === 200 && result.data) {
          if (result.data.imageUrls && Array.isArray(result.data.imageUrls)) {
            // 确保URL是完整的
            const imageUrls = result.data.imageUrls.map((url) => {
              if (url.startsWith("http")) return url;
              return getFullUrl(url);
            });
            allImageUrls = [...allImageUrls, ...imageUrls];
          }
        }
      } catch (error) {
        // 继续上传下一张图片
      }
    }

    // 如果有帖子ID，更新帖子的图片信息
    if (options.postId && allImageUrls.length > 0) {
      try {
        await updatePostImages(options.postId, allImageUrls);
      } catch (error) {
        // 不影响主流程，继续返回上传结果
      }
    }

    return {
      code: 200,
      message: "图片上传成功",
      data: {
        imageUrls: allImageUrls,
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * 更新帖子图片
 * @param {String|Number} postId 帖子ID
 * @param {Array<String>} imageUrls 图片URL数组
 * @returns {Promise} 更新结果
 */
export const updatePostImages = async (postId, imageUrls) => {
  try {
    if (!postId && postId !== 0) {
      throw new Error("帖子ID不能为空");
    }

    if (!imageUrls || !Array.isArray(imageUrls)) {
      throw new Error("图片URL数组不能为空");
    }

    const imagesStr = JSON.stringify(imageUrls);

    const response = await put(`/api/posts/${postId}/images`, { imagesStr });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * 上传帖子图片（字符串版本）
 * @param {Object} options 上传选项
 * @param {Array<String>} options.filePaths 本地文件路径数组
 * @param {String} options.imagesStr 现有图片URL字符串（多个URL用"||"分隔，可选）
 * @param {String} options.userId 用户ID（可选）
 * @param {String|Number} options.postId 帖子ID（可选，关联到特定帖子）
 * @param {Function} options.onProgress 上传进度回调函数（可选）
 * @returns {Promise} 上传结果，包含合并后的图片URL字符串和URL数组
 */
export const uploadPostImagesString = async (options = {}) => {
  try {
    if (
      !options.filePaths ||
      !Array.isArray(options.filePaths) ||
      options.filePaths.length === 0
    ) {
      throw new Error("文件路径数组不能为空");
    }

    // 导入BASE_URL以构建完整URL
    const { BASE_URL, getFullUrl } = require("./config");
    const fullUploadUrl = BASE_URL + "/api/upload/post/images/string";

    // 顺序上传图片，保证imagesStr的积累效果
    let currentImagesStr = options.imagesStr || "";
    let allImageUrls = [];
    let newImageUrls = [];

    for (const filePath of options.filePaths) {
      try {
        const result = await new Promise((resolve, reject) => {
          // 构建表单数据
          const formData = {
            returnFullUrl: "true", // 请求后端返回完整URL
            baseUrl: BASE_URL, // 提供基础URL给后端
          };

          if (options.userId) formData.userId = options.userId;
          if (options.postId) formData.postId = options.postId;
          if (currentImagesStr) formData.imagesStr = currentImagesStr;

          uni.uploadFile({
            url: fullUploadUrl, // 使用完整URL
            filePath: filePath,
            name: "files", // 与后端接口参数名对应
            header: {
              "content-type": "multipart/form-data",
            },
            formData,
            success: (res) => {
              if (res.statusCode === 200) {
                try {
                  // 解析返回的JSON字符串
                  const data =
                    typeof res.data === "string"
                      ? JSON.parse(res.data)
                      : res.data;
                  resolve(data);
                } catch (error) {
                  reject(new Error("解析响应数据失败"));
                }
              } else {
                reject({
                  statusCode: res.statusCode,
                  message: "上传失败",
                  data: res.data,
                });
              }
            },
            fail: (err) => {
              reject({
                statusCode: -1,
                message: err.errMsg || "网络异常",
                error: err,
              });
            },
          });
        });

        // 更新当前的imagesStr，用于下一次上传
        if (result && result.code === 200 && result.data) {
          currentImagesStr = result.data.imagesStr || currentImagesStr;

          // 更新图片URL数组
          if (result.data.imageUrls && Array.isArray(result.data.imageUrls)) {
            allImageUrls = result.data.imageUrls;
          }

          // 获取新上传的图片URL
          if (
            result.data.newImageUrls &&
            Array.isArray(result.data.newImageUrls)
          ) {
            newImageUrls = [...newImageUrls, ...result.data.newImageUrls];
          }
        }
      } catch (error) {
        // 继续上传下一张图片
      }
    }

    // 如果有帖子ID，更新帖子的图片信息
    if (
      options.postId &&
      currentImagesStr &&
      currentImagesStr !== options.imagesStr
    ) {
      try {
        await updatePostImagesString(options.postId, currentImagesStr);
      } catch (error) {
        // 不影响主流程，继续返回上传结果
      }
    }

    // 确保返回的图片URL是完整的URL
    const ensureFullUrls = (urls) => {
      if (!Array.isArray(urls)) return [];
      return urls.map((url) => {
        if (url.startsWith("http")) return url;
        return getFullUrl(url);
      });
    };

    // 返回上传结果
    return {
      code: 200,
      message: "图片上传成功",
      data: {
        imagesStr: currentImagesStr,
        imageUrls: ensureFullUrls(allImageUrls),
        newImageUrls: ensureFullUrls(newImageUrls),
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * 更新帖子图片（字符串版本）
 * @param {String|Number} postId 帖子ID
 * @param {String} imagesStr 图片URL字符串（多个URL用"||"分隔）
 * @returns {Promise} 更新结果
 */
export const updatePostImagesString = async (postId, imagesStr) => {
  try {
    if (!postId && postId !== 0) {
      throw new Error("帖子ID不能为空");
    }

    if (!imagesStr || typeof imagesStr !== "string") {
      throw new Error("图片URL字符串不能为空");
    }

    const response = await put(`/api/posts/${postId}/images/string`, {
      imagesStr,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
