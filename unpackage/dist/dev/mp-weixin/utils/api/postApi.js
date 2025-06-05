"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api_request = require("./request.js");
const fetchPosts = async (params = {}) => {
  try {
    const response = await utils_api_request.get("/api/posts", params);
    return response || [];
  } catch (error) {
    throw error;
  }
};
const fetchPostById = async (postId) => {
  try {
    if (!postId && postId !== 0) {
      throw new Error("帖子ID不能为空");
    }
    const response = await utils_api_request.get(`/api/posts/${postId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
const createPost = async (data) => {
  try {
    if (!data.userId && data.userId !== 0) {
      throw new Error("用户ID不能为空");
    }
    if (!data.productId && data.productId !== 0) {
      throw new Error("产品ID不能为空");
    }
    const postData = { ...data };
    postData.userId = String(postData.userId);
    postData.productId = String(postData.productId);
    if (!postData.title)
      throw new Error("帖子标题不能为空");
    if (!postData.content)
      throw new Error("帖子内容不能为空");
    if (postData.images && Array.isArray(postData.images) && postData.images.length > 0 && !postData.imagesStr) {
      postData.imagesStr = postData.images.join("||");
    }
    if (postData.imagesStr && (!postData.images || !Array.isArray(postData.images) || postData.images.length === 0)) {
      postData.images = postData.imagesStr.split("||").filter((url) => url && url.trim() !== "");
    }
    try {
      const response = await utils_api_request.post(`/api/posts?userId=${postData.userId}`, {
        title: postData.title,
        content: postData.content,
        productId: postData.productId,
        images: postData.images,
        imagesStr: postData.imagesStr
      });
      return response;
    } catch (error1) {
      const response = await utils_api_request.post("/api/posts", postData);
      return response;
    }
  } catch (error) {
    throw error;
  }
};
const updatePost = async (postId, data) => {
  try {
    if (!postId && postId !== 0) {
      throw new Error("帖子ID不能为空");
    }
    const response = await utils_api_request.put(`/api/posts/${postId}`, data);
    return response;
  } catch (error) {
    throw error;
  }
};
const deletePost = async (postId) => {
  try {
    if (!postId && postId !== 0) {
      throw new Error("帖子ID不能为空");
    }
    const response = await utils_api_request.del(`/api/posts/${postId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
const fetchUserPosts = async (userId, params = {}) => {
  try {
    if (!userId && userId !== 0) {
      throw new Error("用户ID不能为空");
    }
    const response = await utils_api_request.get(`/api/posts/users/${userId}/posts`, params);
    return response || [];
  } catch (error) {
    throw error;
  }
};
const fetchProductPosts = async (productId, params = {}) => {
  try {
    if (!productId && productId !== 0) {
      throw new Error("商品ID不能为空");
    }
    const response = await utils_api_request.get(`/api/posts/product/${productId}`, params);
    return response || [];
  } catch (error) {
    throw error;
  }
};
const fetchPostComments = async (postId, params = {}) => {
  try {
    if (!postId && postId !== 0) {
      throw new Error("帖子ID不能为空");
    }
    const response = await utils_api_request.get(`/api/posts/${postId}/comments`, params);
    return response || [];
  } catch (error) {
    throw error;
  }
};
const createComment = async (data) => {
  try {
    if (!data.postId && data.postId !== 0) {
      throw new Error("帖子ID不能为空");
    }
    if (!data.content || data.content.trim() === "") {
      throw new Error("评论内容不能为空");
    }
    const response = await utils_api_request.post("/api/comments", data);
    return response;
  } catch (error) {
    throw error;
  }
};
const deleteComment = async (commentId) => {
  try {
    if (!commentId && commentId !== 0) {
      throw new Error("评论ID不能为空");
    }
    const response = await utils_api_request.del(`/api/comments/${commentId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
const likeOrUnlike = async (targetId, targetType, userId) => {
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
    const response = await utils_api_request.post(
      `/api/${targetType}/${targetId}/like?userId=${userId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
const fetchUserLikedPosts = async (userId, params = {}) => {
  try {
    if (!userId) {
      throw new Error("用户ID不能为空");
    }
    const response = await utils_api_request.get(`/api/users/${userId}/liked-posts`, params);
    return response || { code: 0, data: { posts: [] } };
  } catch (error) {
    throw error;
  }
};
const checkUserLike = async (params = {}) => {
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
    const response = await utils_api_request.get("/api/users/check-like", params);
    return response;
  } catch (error) {
    throw error;
  }
};
const batchCheckUserLike = async (userId, data) => {
  try {
    if (!userId) {
      throw new Error("用户ID不能为空");
    }
    if (!data.targetIds || !Array.isArray(data.targetIds) || data.targetIds.length === 0) {
      throw new Error("目标ID数组不能为空");
    }
    if (data.targetType !== 1 && data.targetType !== 2) {
      throw new Error("目标类型必须为1(帖子)或2(评论)");
    }
    const response = await utils_api_request.post(
      `/api/users/batch-check-like?userId=${userId}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};
const uploadPostImages = async (options = {}) => {
  try {
    if (!options.filePaths || !Array.isArray(options.filePaths) || options.filePaths.length === 0) {
      throw new Error("文件路径数组不能为空");
    }
    const { BASE_URL, getFullUrl } = require("./config");
    const fullUploadUrl = BASE_URL + "/api/upload/post/images";
    let allImageUrls = [];
    for (const filePath of options.filePaths) {
      try {
        const result = await new Promise((resolve, reject) => {
          const formData = {
            returnFullUrl: "true",
            // 请求后端返回完整URL
            baseUrl: BASE_URL
            // 提供基础URL给后端
          };
          if (options.userId)
            formData.userId = options.userId;
          if (options.postId)
            formData.postId = options.postId;
          common_vendor.index.uploadFile({
            url: fullUploadUrl,
            filePath,
            name: "files",
            // 与后端接口参数名对应
            header: {
              "content-type": "multipart/form-data"
            },
            formData,
            success: (res) => {
              if (res.statusCode === 200) {
                try {
                  const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
                  resolve(data);
                } catch (error) {
                  reject(new Error("解析响应数据失败"));
                }
              } else {
                reject({
                  statusCode: res.statusCode,
                  message: "上传失败",
                  data: res.data
                });
              }
            },
            fail: (err) => {
              reject({
                statusCode: -1,
                message: err.errMsg || "网络异常",
                error: err
              });
            }
          });
        });
        if (result && result.code === 200 && result.data) {
          if (result.data.imageUrls && Array.isArray(result.data.imageUrls)) {
            const imageUrls = result.data.imageUrls.map((url) => {
              if (url.startsWith("http"))
                return url;
              return getFullUrl(url);
            });
            allImageUrls = [...allImageUrls, ...imageUrls];
          }
        }
      } catch (error) {
      }
    }
    if (options.postId && allImageUrls.length > 0) {
      try {
        await updatePostImages(options.postId, allImageUrls);
      } catch (error) {
      }
    }
    return {
      code: 200,
      message: "图片上传成功",
      data: {
        imageUrls: allImageUrls
      }
    };
  } catch (error) {
    throw error;
  }
};
const updatePostImages = async (postId, imageUrls) => {
  try {
    if (!postId && postId !== 0) {
      throw new Error("帖子ID不能为空");
    }
    if (!imageUrls || !Array.isArray(imageUrls)) {
      throw new Error("图片URL数组不能为空");
    }
    const imagesStr = JSON.stringify(imageUrls);
    const response = await utils_api_request.put(`/api/posts/${postId}/images`, { imagesStr });
    return response;
  } catch (error) {
    throw error;
  }
};
const uploadPostImagesString = async (options = {}) => {
  try {
    if (!options.filePaths || !Array.isArray(options.filePaths) || options.filePaths.length === 0) {
      throw new Error("文件路径数组不能为空");
    }
    const { BASE_URL, getFullUrl } = require("./config");
    const fullUploadUrl = BASE_URL + "/api/upload/post/images/string";
    let currentImagesStr = options.imagesStr || "";
    let allImageUrls = [];
    let newImageUrls = [];
    for (const filePath of options.filePaths) {
      try {
        const result = await new Promise((resolve, reject) => {
          const formData = {
            returnFullUrl: "true",
            // 请求后端返回完整URL
            baseUrl: BASE_URL
            // 提供基础URL给后端
          };
          if (options.userId)
            formData.userId = options.userId;
          if (options.postId)
            formData.postId = options.postId;
          if (currentImagesStr)
            formData.imagesStr = currentImagesStr;
          common_vendor.index.uploadFile({
            url: fullUploadUrl,
            // 使用完整URL
            filePath,
            name: "files",
            // 与后端接口参数名对应
            header: {
              "content-type": "multipart/form-data"
            },
            formData,
            success: (res) => {
              if (res.statusCode === 200) {
                try {
                  const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
                  resolve(data);
                } catch (error) {
                  reject(new Error("解析响应数据失败"));
                }
              } else {
                reject({
                  statusCode: res.statusCode,
                  message: "上传失败",
                  data: res.data
                });
              }
            },
            fail: (err) => {
              reject({
                statusCode: -1,
                message: err.errMsg || "网络异常",
                error: err
              });
            }
          });
        });
        if (result && result.code === 200 && result.data) {
          currentImagesStr = result.data.imagesStr || currentImagesStr;
          if (result.data.imageUrls && Array.isArray(result.data.imageUrls)) {
            allImageUrls = result.data.imageUrls;
          }
          if (result.data.newImageUrls && Array.isArray(result.data.newImageUrls)) {
            newImageUrls = [...newImageUrls, ...result.data.newImageUrls];
          }
        }
      } catch (error) {
      }
    }
    if (options.postId && currentImagesStr && currentImagesStr !== options.imagesStr) {
      try {
        await updatePostImagesString(options.postId, currentImagesStr);
      } catch (error) {
      }
    }
    const ensureFullUrls = (urls) => {
      if (!Array.isArray(urls))
        return [];
      return urls.map((url) => {
        if (url.startsWith("http"))
          return url;
        return getFullUrl(url);
      });
    };
    return {
      code: 200,
      message: "图片上传成功",
      data: {
        imagesStr: currentImagesStr,
        imageUrls: ensureFullUrls(allImageUrls),
        newImageUrls: ensureFullUrls(newImageUrls)
      }
    };
  } catch (error) {
    throw error;
  }
};
const updatePostImagesString = async (postId, imagesStr) => {
  try {
    if (!postId && postId !== 0) {
      throw new Error("帖子ID不能为空");
    }
    if (!imagesStr || typeof imagesStr !== "string") {
      throw new Error("图片URL字符串不能为空");
    }
    const response = await utils_api_request.put(`/api/posts/${postId}/images/string`, {
      imagesStr
    });
    return response;
  } catch (error) {
    throw error;
  }
};
const postApi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  batchCheckUserLike,
  checkUserLike,
  createComment,
  createPost,
  deleteComment,
  deletePost,
  fetchPostById,
  fetchPostComments,
  fetchPosts,
  fetchProductPosts,
  fetchUserLikedPosts,
  fetchUserPosts,
  likeOrUnlike,
  updatePost,
  updatePostImages,
  updatePostImagesString,
  uploadPostImages,
  uploadPostImagesString
}, Symbol.toStringTag, { value: "Module" }));
exports.batchCheckUserLike = batchCheckUserLike;
exports.checkUserLike = checkUserLike;
exports.createComment = createComment;
exports.createPost = createPost;
exports.fetchPostById = fetchPostById;
exports.fetchPostComments = fetchPostComments;
exports.fetchPosts = fetchPosts;
exports.fetchUserLikedPosts = fetchUserLikedPosts;
exports.fetchUserPosts = fetchUserPosts;
exports.likeOrUnlike = likeOrUnlike;
exports.postApi = postApi;
exports.uploadPostImagesString = uploadPostImagesString;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/api/postApi.js.map
