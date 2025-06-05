"use strict";
const common_vendor = require("../../../../common/vendor.js");
const utils_api_postApi = require("../../../../utils/api/postApi.js");
const utils_userData = require("../../../../utils/userData.js");
const _sfc_main = {
  name: "CommentSection",
  props: {
    // 帖子ID
    postId: {
      type: [String, Number],
      required: true
    },
    // 帖子作者ID
    authorId: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      comments: [],
      // 评论列表
      commentText: "",
      // 评论内容
      page: 1,
      // 当前页码
      size: 10,
      // 每页数量
      totalComments: 0,
      // 评论总数
      hasMoreComments: false,
      // 是否有更多评论
      loading: false,
      // 加载状态
      replyToComment: null,
      // 被回复的评论
      scrollTop: 0
      // 滚动位置
    };
  },
  computed: {
    // 一级评论（parentId为null或undefined）
    rootComments() {
      return this.comments.filter((c) => !c.parentId);
    },
    // 回复映射表（parentId为key，value为回复数组）
    repliesMap() {
      const map = {};
      this.comments.forEach((c) => {
        if (c.parentId) {
          if (!map[c.parentId])
            map[c.parentId] = [];
          map[c.parentId].push(c);
        }
      });
      Object.keys(map).forEach((key) => {
        map[key].sort((a, b) => {
          const timeA = new Date(a.createdAt || a.createTime || 0).getTime();
          const timeB = new Date(b.createdAt || b.createTime || 0).getTime();
          return timeA - timeB;
        });
      });
      return map;
    }
  },
  created() {
    this.getComments();
  },
  methods: {
    // 检查用户是否是帖子作者
    isAuthor(userId) {
      return userId && this.authorId && userId == this.authorId;
    },
    // 获取评论列表
    async getComments(isLoadMore = false) {
      if (this.loading)
        return;
      try {
        this.loading = true;
        const params = {
          page: isLoadMore ? this.page + 1 : 1,
          size: this.size
        };
        const response = await utils_api_postApi.fetchPostComments(this.postId, params);
        let commentsData = null;
        if (response && response.data) {
          commentsData = response.data;
        } else if (response && response.code === 200) {
          commentsData = response;
        }
        if (commentsData) {
          const { comments, total, hasMore } = commentsData;
          const processedComments = (comments == null ? void 0 : comments.map((comment) => {
            if (comment.createTime && !comment.createdAt) {
              comment.createdAt = comment.createTime;
            }
            if (comment.likesCount === void 0) {
              comment.likesCount = comment.likesCount || 0;
            }
            comment.isLiked = false;
            if (comment.replies && comment.replies.length > 0) {
              comment.replies = comment.replies.map((reply) => {
                if (reply.createTime && !reply.createdAt) {
                  reply.createdAt = reply.createTime;
                }
                if (reply.likesCount === void 0) {
                  reply.likesCount = reply.likesCount || 0;
                }
                reply.isLiked = false;
                if (!reply.replyToUser && reply.replyToUserId) {
                  const foundUser = this.findUserInComments(
                    reply.replyToUserId
                  );
                  if (foundUser) {
                    reply.replyToUser = foundUser;
                  } else {
                    reply.replyToUser = {
                      userId: reply.replyToUserId,
                      nickname: "用户",
                      avatar: "/static/images/avatar.png"
                    };
                  }
                }
                return reply;
              });
            } else {
              comment.replies = comment.replies || [];
            }
            return comment;
          })) || [];
          if (isLoadMore && processedComments.length > 0) {
            this.comments = [...this.comments, ...processedComments];
            this.page++;
          } else if (processedComments.length > 0) {
            this.comments = processedComments;
            this.page = 1;
            this.resetScrollTop();
          }
          this.totalComments = total || this.comments.length;
          this.hasMoreComments = hasMore || false;
          this.$nextTick(() => {
            this.checkCommentLikeStatus();
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "获取评论失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    // 在评论列表中查找用户
    findUserInComments(userId) {
      if (!userId)
        return null;
      for (const comment of this.comments) {
        if (comment.user && comment.user.userId === userId) {
          return comment.user;
        }
        if (comment.replies && comment.replies.length > 0) {
          for (const reply of comment.replies) {
            if (reply.user && reply.user.userId === userId) {
              return reply.user;
            }
          }
        }
      }
      return null;
    },
    // 加载更多评论
    loadMoreComments() {
      this.getComments(true);
    },
    // 重置滚动位置
    resetScrollTop() {
      setTimeout(() => {
        this.scrollTop = 0;
      }, 100);
    },
    // 提交评论
    async submitComment() {
      var _a, _b, _c, _d, _e, _f;
      if (!this.commentText.trim())
        return;
      try {
        const commentData = {
          postId: this.postId,
          content: this.commentText.trim(),
          userId: utils_userData.userData.userId
          // 添加用户ID
        };
        if (this.replyToComment) {
          commentData.parentId = this.replyToComment.commentId;
          commentData.replyToUserId = (_a = this.replyToComment.user) == null ? void 0 : _a.userId;
        }
        const response = await utils_api_postApi.createComment(commentData);
        if (response && (response.success || response.code === 200)) {
          common_vendor.index.showToast({
            title: "评论成功",
            icon: "success"
          });
          const newComment = {
            commentId: ((_b = response.data) == null ? void 0 : _b.commentId) || `temp-${Date.now()}`,
            content: this.commentText.trim(),
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            createTime: (/* @__PURE__ */ new Date()).toISOString(),
            user: {
              userId: utils_userData.userData.userId,
              nickname: utils_userData.userData.nickname,
              avatar: utils_userData.userData.avatar
            },
            likesCount: 0,
            isLiked: false,
            // 明确设置为未点赞状态
            status: 1,
            postId: this.postId
          };
          if (this.replyToComment) {
            newComment.parentId = this.replyToComment.commentId;
            newComment.replyToUserId = (_c = this.replyToComment.user) == null ? void 0 : _c.userId;
            newComment.replyToUser = {
              userId: (_d = this.replyToComment.user) == null ? void 0 : _d.userId,
              nickname: ((_e = this.replyToComment.user) == null ? void 0 : _e.nickname) || "匿名用户",
              avatar: ((_f = this.replyToComment.user) == null ? void 0 : _f.avatar) || "/static/images/avatar.png"
            };
            const parentComment = this.comments.find(
              (c) => c.commentId === this.replyToComment.commentId
            );
            if (parentComment) {
              if (!parentComment.replies)
                parentComment.replies = [];
              parentComment.replies.push(newComment);
            }
          }
          if (!this.replyToComment) {
            newComment.replies = [];
            this.comments.unshift(newComment);
          } else {
            this.comments.unshift(newComment);
          }
          this.totalComments++;
          this.commentText = "";
          this.replyToComment = null;
          this.resetScrollTop();
          setTimeout(() => {
            this.getComments();
          }, 500);
        } else {
          common_vendor.index.showToast({
            title: "评论可能未成功提交",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "评论失败，请重试",
          icon: "none"
        });
      }
    },
    // 回复评论
    onReplyComment(comment) {
      var _a;
      this.replyToComment = comment;
      const replyToName = ((_a = comment.user) == null ? void 0 : _a.nickname) || "匿名用户";
      common_vendor.index.showToast({
        title: `回复 ${replyToName}`,
        icon: "none"
      });
      this.$nextTick(() => {
        const inputSelector = common_vendor.index.createSelectorQuery().in(this);
        inputSelector.select(".comment-input").boundingClientRect();
        inputSelector.selectViewport().scrollOffset();
        inputSelector.exec((res) => {
          if (res && res[0]) {
            common_vendor.index.pageScrollTo({
              scrollTop: res[0].top,
              duration: 300
            });
          }
        });
      });
    },
    // 格式化时间
    formatTime(timestamp) {
      if (!timestamp)
        return "";
      const now = /* @__PURE__ */ new Date();
      const commentDate = new Date(timestamp);
      const diffInSeconds = Math.floor((now - commentDate) / 1e3);
      if (diffInSeconds < 60) {
        return "刚刚";
      } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)}分钟前`;
      } else if (diffInSeconds < 86400) {
        return `${Math.floor(diffInSeconds / 3600)}小时前`;
      } else if (diffInSeconds < 604800) {
        return `${Math.floor(diffInSeconds / 86400)}天前`;
      } else {
        const year = commentDate.getFullYear();
        const month = (commentDate.getMonth() + 1).toString().padStart(2, "0");
        const day = commentDate.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
    },
    // 加载更多，如果需要
    loadMoreIfNeeded() {
      if (this.hasMoreComments) {
        this.loadMoreComments();
      }
    },
    // 处理点赞评论
    async handleLikeComment(comment) {
      try {
        if (!utils_userData.userData.userId) {
          common_vendor.index.showToast({
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        const targetId = comment.commentId;
        const prevLikeCount = comment.likesCount || 0;
        comment.isLiked = !comment.isLiked;
        comment.likesCount = comment.isLiked ? prevLikeCount + 1 : Math.max(prevLikeCount - 1, 0);
        const response = await utils_api_postApi.likeOrUnlike(
          targetId,
          2,
          // 目标类型为评论(2)
          utils_userData.userData.userId
        );
        if (response && response.code === 200 && response.data) {
          if (response.data.liked !== void 0) {
            comment.isLiked = response.data.liked;
          }
        } else {
          comment.isLiked = !comment.isLiked;
          comment.likesCount = prevLikeCount;
          common_vendor.index.showToast({
            title: "操作失败，请重试",
            icon: "none"
          });
        }
      } catch (error) {
        comment.isLiked = !comment.isLiked;
        const originalLikeCount = comment.isLiked ? Math.max((comment.likesCount || 0) - 1, 0) : (comment.likesCount || 0) + 1;
        comment.likesCount = originalLikeCount;
        common_vendor.index.showToast({
          title: "点赞失败，请重试",
          icon: "none"
        });
      }
    },
    async checkCommentLikeStatus() {
      if (!utils_userData.userData.userId) {
        return;
      }
      try {
        if (this.comments.length > 0) {
          const targetIds = this.comments.map((comment) => comment.commentId);
          const data = {
            targetIds,
            targetType: 2
            // 评论类型为2
          };
          const response = await utils_api_postApi.batchCheckUserLike(utils_userData.userData.userId, data);
          if (response && response.code === 200 && response.data) {
            this.comments.forEach((comment) => {
              const targetId = comment.commentId;
              if (response.data.hasOwnProperty(targetId)) {
                this.$set(comment, "isLiked", response.data[targetId]);
                if (comment.likesCount === void 0) {
                  this.$set(comment, "likesCount", 0);
                }
              }
            });
          }
        }
      } catch (error) {
        try {
          const promises = this.comments.map(async (comment) => {
            try {
              const targetId = comment.commentId;
              const params = {
                targetId,
                targetType: 2,
                // 评论类型为2
                userId: utils_userData.userData.userId
              };
              const response = await utils_api_postApi.checkUserLike(params);
              if (response && response.code === 200 && response.data) {
                this.$set(comment, "isLiked", response.data.liked || false);
                if (comment.likesCount === void 0) {
                  this.$set(comment, "likesCount", 0);
                }
              }
            } catch (err) {
              comment.isLiked = !comment.isLiked;
              const originalLikeCount = comment.isLiked ? Math.max((comment.likesCount || 0) - 1, 0) : (comment.likesCount || 0) + 1;
              comment.likesCount = originalLikeCount;
            }
          });
          await Promise.all(promises);
        } catch (backupError) {
          this.comments.forEach((comment) => {
            comment.isLiked = !comment.isLiked;
            const originalLikeCount = comment.isLiked ? Math.max((comment.likesCount || 0) - 1, 0) : (comment.likesCount || 0) + 1;
            comment.likesCount = originalLikeCount;
            common_vendor.index.showToast({
              title: "点赞失败，请重试",
              icon: "none"
            });
          });
        }
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a;
  return common_vendor.e({
    a: common_vendor.t($data.totalComments),
    b: $options.rootComments.length > 0
  }, $options.rootComments.length > 0 ? {
    c: common_vendor.f($options.rootComments, (comment, index, i0) => {
      var _a2, _b, _c, _d;
      return common_vendor.e({
        a: ((_a2 = comment.user) == null ? void 0 : _a2.avatar) || "/static/images/avatar.png",
        b: common_vendor.t(((_b = comment.user) == null ? void 0 : _b.nickname) || "匿名用户"),
        c: $options.isAuthor((_c = comment.user) == null ? void 0 : _c.userId)
      }, $options.isAuthor((_d = comment.user) == null ? void 0 : _d.userId) ? {} : {}, {
        d: common_vendor.t($options.formatTime(comment.createdAt || comment.createTime)),
        e: common_vendor.t(comment.content),
        f: comment.isLiked ? "/static/fonts/like-filled.svg" : "/static/fonts/like.svg",
        g: common_vendor.t(comment.likesCount || 0),
        h: common_vendor.o(($event) => $options.handleLikeComment(comment), comment.commentId || index),
        i: common_vendor.o(($event) => $options.onReplyComment(comment), comment.commentId || index),
        j: $options.repliesMap[comment.commentId] && $options.repliesMap[comment.commentId].length
      }, $options.repliesMap[comment.commentId] && $options.repliesMap[comment.commentId].length ? {
        k: common_vendor.f($options.repliesMap[comment.commentId], (reply, replyIndex, i1) => {
          var _a3, _b2, _c2, _d2;
          return common_vendor.e({
            a: ((_a3 = reply.user) == null ? void 0 : _a3.avatar) || "/static/images/avatar.png",
            b: common_vendor.t(((_b2 = reply.user) == null ? void 0 : _b2.nickname) || "匿名用户"),
            c: $options.isAuthor((_c2 = reply.user) == null ? void 0 : _c2.userId)
          }, $options.isAuthor((_d2 = reply.user) == null ? void 0 : _d2.userId) ? {} : {}, {
            d: common_vendor.t($options.formatTime(reply.createdAt || reply.createTime)),
            e: reply.replyToUser
          }, reply.replyToUser ? {
            f: common_vendor.t(reply.replyToUser.nickname || "匿名用户")
          } : {}, {
            g: common_vendor.t(reply.content),
            h: reply.isLiked ? "/static/fonts/like-filled.svg" : "/static/fonts/like.svg",
            i: common_vendor.t(reply.likesCount || 0),
            j: common_vendor.o(($event) => $options.handleLikeComment(reply), reply.commentId || replyIndex),
            k: common_vendor.o(($event) => $options.onReplyComment(reply), reply.commentId || replyIndex),
            l: reply.commentId || replyIndex
          });
        })
      } : {}, {
        l: comment.commentId || index
      });
    })
  } : {}, {
    d: $options.rootComments.length === 0
  }, $options.rootComments.length === 0 ? {} : {}, {
    e: $data.hasMoreComments
  }, $data.hasMoreComments ? {
    f: common_vendor.o((...args) => $options.loadMoreComments && $options.loadMoreComments(...args))
  } : {}, {
    g: $data.loading
  }, $data.loading ? {} : {}, {
    h: $data.scrollTop,
    i: common_vendor.o((...args) => $options.loadMoreIfNeeded && $options.loadMoreIfNeeded(...args)),
    j: $data.replyToComment ? `回复 ${((_a = $data.replyToComment.user) == null ? void 0 : _a.nickname) || "匿名用户"}` : "说点什么...",
    k: common_vendor.o((...args) => $options.submitComment && $options.submitComment(...args)),
    l: $data.commentText,
    m: common_vendor.o(($event) => $data.commentText = $event.detail.value),
    n: !$data.commentText.trim(),
    o: common_vendor.o((...args) => $options.submitComment && $options.submitComment(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/post-detail/c-cpns/comment-section/comment-section.js.map
