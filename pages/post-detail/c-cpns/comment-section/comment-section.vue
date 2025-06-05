<template>
  <view class="comment-section">
    <!-- 评论标题 -->
    <view class="comment-header">
      <text class="comment-title">评论 ({{ totalComments }})</text>
    </view>

    <!-- 嵌套评论结构，添加滚动功能 -->
    <scroll-view
      class="comment-scroll"
      scroll-y="true"
      :scroll-top="scrollTop"
      @scrolltolower="loadMoreIfNeeded"
    >
      <view class="comment-list" v-if="rootComments.length > 0">
        <view
          class="comment-item"
          v-for="(comment, index) in rootComments"
          :key="comment.commentId || index"
        >
          <!-- 用户头像 -->
          <image
            class="commenter-avatar"
            :src="comment.user?.avatar || '/static/images/avatar.png'"
            mode="aspectFill"
          ></image>

          <!-- 评论内容区域 -->
          <view class="comment-content">
            <!-- 用户名和评论时间 -->
            <view class="comment-info">
              <text class="commenter-name">{{
                comment.user?.nickname || "匿名用户"
              }}</text>
              <!-- 作者标记 -->
              <view class="author-tag" v-if="isAuthor(comment.user?.userId)">
                <text class="author-tag-text">作者</text>
              </view>
              <text class="comment-time">{{
                formatTime(comment.createdAt || comment.createTime)
              }}</text>
            </view>

            <!-- 评论文本和回复按钮放在同一行 -->
            <view class="comment-text-actions">
              <view class="comment-text-container">
                <text class="comment-text">{{ comment.content }}</text>
              </view>

              <!-- 回复按钮 -->
              <view class="comment-actions">
                <!-- 添加点赞按钮 -->
                <view
                  class="action-btn like-btn"
                  @click="handleLikeComment(comment)"
                >
                  <image
                    class="like-icon"
                    :src="
                      comment.isLiked
                        ? '/static/fonts/like-filled.svg'
                        : '/static/fonts/like.svg'
                    "
                    mode="aspectFit"
                  ></image>
                  <text class="like-count">{{ comment.likesCount || 0 }}</text>
                </view>
                <view class="action-btn" @click="onReplyComment(comment)">
                  <text class="action-text">回复</text>
                </view>
              </view>
            </view>

            <!-- 小评论区：该评论下的所有回复 -->
            <view
              class="reply-area"
              v-if="
                repliesMap[comment.commentId] &&
                repliesMap[comment.commentId].length
              "
            >
              <view
                class="reply-item"
                v-for="(reply, replyIndex) in repliesMap[comment.commentId]"
                :key="reply.commentId || replyIndex"
              >
                <view class="reply-header">
                  <image
                    class="reply-avatar"
                    :src="reply.user?.avatar || '/static/images/avatar.png'"
                    mode="aspectFill"
                  ></image>

                  <view class="reply-header-info">
                    <view class="reply-info">
                      <text class="reply-name">{{
                        reply.user?.nickname || "匿名用户"
                      }}</text>
                      <view
                        class="author-tag small"
                        v-if="isAuthor(reply.user?.userId)"
                        ><text class="author-tag-text">作者</text></view
                      >
                      <text class="reply-time">{{
                        formatTime(reply.createdAt || reply.createTime)
                      }}</text>
                    </view>

                    <!-- 回复内容和回复按钮放在同一行 -->
                    <view class="reply-content-actions">
                      <view class="reply-content">
                        <text class="reply-at-user" v-if="reply.replyToUser"
                          >@{{ reply.replyToUser.nickname || "匿名用户" }}</text
                        >
                        <text class="reply-text">{{ reply.content }}</text>
                      </view>

                      <view class="reply-actions">
                        <!-- 添加点赞按钮 -->
                        <view
                          class="reply-like-btn"
                          @click="handleLikeComment(reply)"
                        >
                          <image
                            class="like-icon small"
                            :src="
                              reply.isLiked
                                ? '/static/fonts/like-filled.svg'
                                : '/static/fonts/like.svg'
                            "
                            mode="aspectFit"
                          ></image>
                          <text class="reply-like-count">{{
                            reply.likesCount || 0
                          }}</text>
                        </view>
                        <view class="reply-btn" @click="onReplyComment(reply)">
                          <text class="reply-btn-text">回复</text>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 暂无评论 -->
      <view class="no-comments" v-if="rootComments.length === 0">
        <text>暂无评论，快来发表第一条评论吧</text>
      </view>

      <!-- 加载更多按钮 -->
      <view class="load-more" v-if="hasMoreComments" @click="loadMoreComments">
        <text class="load-more-text">加载更多评论</text>
      </view>

      <!-- 加载中提示 -->
      <view class="loading-tip" v-if="loading">
        <text>加载中...</text>
      </view>
    </scroll-view>

    <!-- 评论输入区域 -->
    <view class="comment-input-area">
      <input
        class="comment-input"
        v-model="commentText"
        :placeholder="
          replyToComment
            ? `回复 ${replyToComment.user?.nickname || '匿名用户'}`
            : '说点什么...'
        "
        :placeholder-style="'color: #999;'"
        confirm-type="send"
        @confirm="submitComment"
      />
      <button
        class="send-btn"
        :disabled="!commentText.trim()"
        @click="submitComment"
      >
        发送
      </button>
    </view>
  </view>
</template>

<script>
import {
  fetchPostComments,
  createComment,
  checkUserLike,
  likeOrUnlike,
  batchCheckUserLike,
} from "../../../../utils/api/postApi";
import { userData } from "../../../../utils/userData";

export default {
  name: "CommentSection",
  props: {
    // 帖子ID
    postId: {
      type: [String, Number],
      required: true,
    },
    // 帖子作者ID
    authorId: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      comments: [], // 评论列表
      commentText: "", // 评论内容
      page: 1, // 当前页码
      size: 10, // 每页数量
      totalComments: 0, // 评论总数
      hasMoreComments: false, // 是否有更多评论
      loading: false, // 加载状态
      replyToComment: null, // 被回复的评论
      scrollTop: 0, // 滚动位置
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
          if (!map[c.parentId]) map[c.parentId] = [];
          map[c.parentId].push(c);
        }
      });
      // 按时间升序排列
      Object.keys(map).forEach((key) => {
        map[key].sort((a, b) => {
          const timeA = new Date(a.createdAt || a.createTime || 0).getTime();
          const timeB = new Date(b.createdAt || b.createTime || 0).getTime();
          return timeA - timeB;
        });
      });
      return map;
    },
  },
  created() {
    // 获取评论列表
    this.getComments();
  },
  methods: {
    // 检查用户是否是帖子作者
    isAuthor(userId) {
      return userId && this.authorId && userId == this.authorId;
    },

    // 获取评论列表
    async getComments(isLoadMore = false) {
      if (this.loading) return;

      try {
        this.loading = true;

        const params = {
          page: isLoadMore ? this.page + 1 : 1,
          size: this.size,
        };

        const response = await fetchPostComments(this.postId, params);

        // 兼容不同的API返回格式
        let commentsData = null;
        if (response && response.data) {
          commentsData = response.data;
        } else if (response && response.code === 200) {
          commentsData = response;
        }

        if (commentsData) {
          const { comments, total, hasMore } = commentsData;

          // 确保每个评论对象的结构完整
          const processedComments =
            comments?.map((comment) => {
              // 标准化时间字段
              if (comment.createTime && !comment.createdAt) {
                comment.createdAt = comment.createTime;
              }

              // 初始化点赞状态和数量
              if (comment.likesCount === undefined) {
                comment.likesCount = comment.likesCount || 0;
              }
              comment.isLiked = false;

              // 处理回复列表
              if (comment.replies && comment.replies.length > 0) {
                comment.replies = comment.replies.map((reply) => {
                  // 标准化时间字段
                  if (reply.createTime && !reply.createdAt) {
                    reply.createdAt = reply.createTime;
                  }

                  // 初始化点赞状态和数量
                  if (reply.likesCount === undefined) {
                    reply.likesCount = reply.likesCount || 0;
                  }
                  reply.isLiked = false;

                  // 根据用户提供的数据，如果有replyToUserId但没有replyToUser，需要构建
                  if (!reply.replyToUser && reply.replyToUserId) {
                    // 从已有评论中尝试找到被回复的用户
                    const foundUser = this.findUserInComments(
                      reply.replyToUserId
                    );
                    if (foundUser) {
                      reply.replyToUser = foundUser;
                    } else {
                      // 如果找不到，创建一个默认的用户对象
                      reply.replyToUser = {
                        userId: reply.replyToUserId,
                        nickname: "用户",
                        avatar: "/static/images/avatar.png",
                      };
                    }
                  }
                  return reply;
                });
              } else {
                comment.replies = comment.replies || [];
              }
              return comment;
            }) || [];

          if (isLoadMore && processedComments.length > 0) {
            // 加载更多时，追加评论
            this.comments = [...this.comments, ...processedComments];
            this.page++;
            // 不重置滚动位置，保持在用户当前浏览的位置
          } else if (processedComments.length > 0) {
            // 首次加载，替换评论
            this.comments = processedComments;
            this.page = 1;
            // 滚动到顶部
            this.resetScrollTop();
          }

          this.totalComments = total || this.comments.length;
          this.hasMoreComments = hasMore || false;

          // 加载完评论后检查点赞状态
          this.$nextTick(() => {
            this.checkCommentLikeStatus();
          });
        }
      } catch (error) {
        uni.showToast({
          title: "获取评论失败",
          icon: "none",
        });
      } finally {
        this.loading = false;
      }
    },

    // 在评论列表中查找用户
    findUserInComments(userId) {
      if (!userId) return null;

      // 检查评论者
      for (const comment of this.comments) {
        if (comment.user && comment.user.userId === userId) {
          return comment.user;
        }

        // 检查回复者
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
      // 延迟执行，确保DOM已更新
      setTimeout(() => {
        this.scrollTop = 0;
      }, 100);
    },

    // 提交评论
    async submitComment() {
      if (!this.commentText.trim()) return;

      try {
        const commentData = {
          postId: this.postId,
          content: this.commentText.trim(),
          userId: userData.userId, // 添加用户ID
        };

        // 如果是回复评论
        if (this.replyToComment) {
          commentData.parentId = this.replyToComment.commentId;
          commentData.replyToUserId = this.replyToComment.user?.userId;
        }

        const response = await createComment(commentData);

        // 检查API返回格式，兼容不同的成功返回格式
        if (response && (response.success || response.code === 200)) {
          uni.showToast({
            title: "评论成功",
            icon: "success",
          });

          // 构建新评论对象，使用API返回的数据结构
          const newComment = {
            commentId: response.data?.commentId || `temp-${Date.now()}`,
            content: this.commentText.trim(),
            createdAt: new Date().toISOString(),
            createTime: new Date().toISOString(),
            user: {
              userId: userData.userId,
              nickname: userData.nickname,
              avatar: userData.avatar,
            },
            likesCount: 0,
            isLiked: false, // 明确设置为未点赞状态
            status: 1,
            postId: this.postId,
          };

          // 如果是回复评论，添加回复相关信息
          if (this.replyToComment) {
            newComment.parentId = this.replyToComment.commentId;
            newComment.replyToUserId = this.replyToComment.user?.userId;
            newComment.replyToUser = {
              userId: this.replyToComment.user?.userId,
              nickname: this.replyToComment.user?.nickname || "匿名用户",
              avatar:
                this.replyToComment.user?.avatar || "/static/images/avatar.png",
            };

            // 将回复添加到对应评论的回复列表中，用于数据完整性
            const parentComment = this.comments.find(
              (c) => c.commentId === this.replyToComment.commentId
            );
            if (parentComment) {
              if (!parentComment.replies) parentComment.replies = [];
              parentComment.replies.push(newComment);
            }
          }

          // 将新评论直接添加到评论数组中
          // 注意：不需要手动更新rootComments和repliesMap，它们是计算属性，会自动更新
          if (!this.replyToComment) {
            newComment.replies = [];
            this.comments.unshift(newComment);
          } else {
            // 如果是回复，也添加到评论数组，便于查看效果
            this.comments.unshift(newComment);
          }

          this.totalComments++;

          // 清空评论内容和回复状态
          this.commentText = "";
          this.replyToComment = null;

          // 重置滚动位置，让用户看到新评论
          this.resetScrollTop();

          // 延迟获取评论列表，确保显示最新评论
          setTimeout(() => {
            this.getComments();
          }, 500);
        } else {
          uni.showToast({
            title: "评论可能未成功提交",
            icon: "none",
          });
        }
      } catch (error) {
        uni.showToast({
          title: "评论失败，请重试",
          icon: "none",
        });
      }
    },

    // 回复评论
    onReplyComment(comment) {
      this.replyToComment = comment;

      // 显示回复提示，确保显示正确的用户名
      const replyToName = comment.user?.nickname || "匿名用户";
      uni.showToast({
        title: `回复 ${replyToName}`,
        icon: "none",
      });

      // 聚焦到输入框
      this.$nextTick(() => {
        const inputSelector = uni.createSelectorQuery().in(this);
        inputSelector.select(".comment-input").boundingClientRect();
        inputSelector.selectViewport().scrollOffset();
        inputSelector.exec((res) => {
          if (res && res[0]) {
            uni.pageScrollTo({
              scrollTop: res[0].top,
              duration: 300,
            });
          }
        });
      });
    },

    // 格式化时间
    formatTime(timestamp) {
      if (!timestamp) return "";

      const now = new Date();
      const commentDate = new Date(timestamp);
      const diffInSeconds = Math.floor((now - commentDate) / 1000);

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
        if (!userData.userId) {
          uni.showToast({
            title: "请先登录",
            icon: "none",
          });
          return;
        }
        // 直接使用原始的commentId，不做格式化处理
        const targetId = comment.commentId;
        // 保存当前点赞数，用于恢复状态
        const prevLikeCount = comment.likesCount || 0;
        // 乐观更新 UI
        comment.isLiked = !comment.isLiked;
        comment.likesCount = comment.isLiked
          ? prevLikeCount + 1
          : Math.max(prevLikeCount - 1, 0);
        // 调用点赞 API，使用正确的参数格式
        const response = await likeOrUnlike(
          targetId,
          2, // 目标类型为评论(2)
          userData.userId
        );
        // 处理响应结果
        if (response && response.code === 200 && response.data) {
          if (response.data.liked !== undefined) {
            comment.isLiked = response.data.liked;
          }
        } else {
          // 如果 API 调用失败，恢复 UI 状态
          comment.isLiked = !comment.isLiked;
          comment.likesCount = prevLikeCount;
          uni.showToast({
            title: "操作失败，请重试",
            icon: "none",
          });
        }
      } catch (error) {
        // 发生错误，恢复 UI 状态到点赞前的状态
        comment.isLiked = !comment.isLiked; // 反转当前状态，恢复到操作前
        // 恢复点赞数量到操作前的状态
        const originalLikeCount = comment.isLiked
          ? Math.max((comment.likesCount || 0) - 1, 0) // 如果现在是已点赞，则减1
          : (comment.likesCount || 0) + 1; // 如果现在是未点赞，则加1
        comment.likesCount = originalLikeCount;
        uni.showToast({
          title: "点赞失败，请重试",
          icon: "none",
        });
      }
    },

    async checkCommentLikeStatus() {
      if (!userData.userId) {
        return;
      }
      try {
        if (this.comments.length > 0) {
          // 直接使用原始的commentId，不做格式化处理
          const targetIds = this.comments.map((comment) => comment.commentId);
          const data = {
            targetIds: targetIds,
            targetType: 2, // 评论类型为2
          };
          const response = await batchCheckUserLike(userData.userId, data);
          // 处理批量检查结果
          if (response && response.code === 200 && response.data) {
            // 遍历评论，更新点赞状态和点赞数量
            this.comments.forEach((comment) => {
              const targetId = comment.commentId; // 使用原始ID
              // 检查该评论ID在返回的结果中是否存在
              if (response.data.hasOwnProperty(targetId)) {
                this.$set(comment, "isLiked", response.data[targetId]);
                // 不更新点赞数量，保持前端显示的数量
                // 如果评论没有点赞数，才初始化为0
                if (comment.likesCount === undefined) {
                  this.$set(comment, "likesCount", 0);
                }
              }
            });
          }
        }
      } catch (error) {
        // 如果批量检查失败，回退到单个检查
        try {
          const promises = this.comments.map(async (comment) => {
            try {
              // 直接使用原始的commentId
              const targetId = comment.commentId;
              const params = {
                targetId: targetId,
                targetType: 2, // 评论类型为2
                userId: userData.userId,
              };
              const response = await checkUserLike(params);
              if (response && response.code === 200 && response.data) {
                this.$set(comment, "isLiked", response.data.liked || false);
                if (comment.likesCount === undefined) {
                  this.$set(comment, "likesCount", 0);
                }
              }
            } catch (err) {
              // 发生错误，恢复 UI 状态到点赞前的状态
              comment.isLiked = !comment.isLiked; // 反转当前状态，恢复到操作前
              const originalLikeCount = comment.isLiked
                ? Math.max((comment.likesCount || 0) - 1, 0)
                : (comment.likesCount || 0) + 1;
              comment.likesCount = originalLikeCount;
            }
          });
          await Promise.all(promises);
        } catch (backupError) {
          // 发生错误，恢复 UI 状态到点赞前的状态
          this.comments.forEach((comment) => {
            comment.isLiked = !comment.isLiked;
            const originalLikeCount = comment.isLiked
              ? Math.max((comment.likesCount || 0) - 1, 0)
              : (comment.likesCount || 0) + 1;
            comment.likesCount = originalLikeCount;
            uni.showToast({
              title: "点赞失败，请重试",
              icon: "none",
            });
          });
        }
      }
    },
  },
};
</script>

<style>
.comment-section {
  background-color: #fff;
  border-radius: 12rpx;
  margin-top: 20rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.comment-header {
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.comment-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.comment-scroll {
  height: calc(100vh - 400rpx); /* 动态计算高度，屏幕高度减去其他UI元素高度 */
  max-height: 800rpx; /* 最大高度限制 */
  min-height: 500rpx; /* 最小高度保证 */
  overflow: auto;
}

.comment-list {
  padding: 20rpx 0;
}

.comment-item {
  display: flex;
  margin-bottom: 30rpx;
}

.commenter-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
  overflow: hidden;
}

.comment-info {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.commenter-name {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
  margin-right: 8rpx;
}

/* 作者标记样式 */
.author-tag {
  width: 20px;
  background-color: #ff9800;
  padding: 2rpx 8rpx;
  border-radius: 8rpx;
  margin-right: 12rpx;
}

.author-tag.small {
  padding: 0 6rpx;
  transform: scale(0.9);
  margin: 0 4rpx;
}

.author-tag-text {
  color: #fff;
  font-size: 20rpx;
  line-height: 1;
}

.comment-time {
  font-size: 22rpx;
  color: #999;
}

.comment-text-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.comment-text-container {
  flex: 1;
  margin-right: 10rpx;
}

.comment-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  word-break: break-all;
}

.reply-at-user {
  color: #1890ff;
  font-weight: bold;
  margin-right: 8rpx;
  font-size: 28rpx;
}

.comment-actions {
  flex-shrink: 0;
}

.action-btn {
  padding: 6rpx 10rpx;
}

.action-text {
  font-size: 24rpx;
  color: #999;
}

.no-comments {
  text-align: center;
  padding: 40rpx 0;
  color: #999;
  font-size: 28rpx;
}

.load-more {
  text-align: center;
  padding: 20rpx 0;
}

.load-more-text {
  font-size: 26rpx;
  color: #1890ff;
}

.comment-input-area {
  display: flex;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.comment-input {
  flex: 1;
  height: 80rpx;
  background-color: #f5f5f5;
  border-radius: 40rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
}

.send-btn {
  margin-left: 20rpx;
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  background-color: #ff9800;
  color: #fff;
  border-radius: 20rpx;
}

.send-btn[disabled] {
  background-color: #ccc;
  color: #fff;
}

/* 二级评论区域样式 */
.reply-area {
  margin-top: 12rpx;
  margin-bottom: 16rpx;
  padding: 16rpx 16rpx 12rpx 16rpx;
  background-color: #f8f8f8;
  border-radius: 12rpx;
  position: relative;
  margin-left: 8rpx;
  border-left: 4rpx solid #e0e0e0;
}

.reply-item {
  position: relative;
  margin-bottom: 16rpx;
  padding-bottom: 12rpx;
  border-bottom: 1rpx solid rgba(238, 238, 238, 0.8);
}

.reply-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.reply-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8rpx;
}

.reply-avatar {
  width: 42rpx;
  height: 42rpx;
  border-radius: 50%;
  margin-right: 12rpx;
  flex-shrink: 0;
  border: 1rpx solid #eee;
}

.reply-header-info {
  flex: 1;
  overflow: hidden;
}

.reply-info {
  display: flex;
  align-items: center;
  margin-bottom: 4rpx;
}

.reply-name {
  font-size: 24rpx;
  color: #333;
  font-weight: bold;
  margin-right: 6rpx;
}

.reply-time {
  font-size: 20rpx;
  color: #999;
}

.reply-content-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6rpx;
}

.reply-content {
  flex: 1;
  font-size: 26rpx;
  color: #333;
  line-height: 1.4;
  word-break: break-all;
  display: flex;
  flex-wrap: wrap;
  margin-right: 10rpx;
}

.reply-actions {
  flex-shrink: 0;
}

.reply-btn {
  padding: 4rpx 10rpx;
}

.reply-btn-text {
  font-size: 22rpx;
  color: #999;
}

.reply-text {
  font-size: 26rpx;
  color: #333;
  line-height: 1.4;
  word-break: break-all;
}

.loading-tip {
  text-align: center;
  padding: 20rpx 0;
  color: #999;
  font-size: 26rpx;
}

/* 点赞按钮样式 */
.like-btn,
.reply-like-btn {
  display: flex;
  align-items: center;
  padding: 6rpx 10rpx;
  margin-right: 10rpx;
}

.like-icon {
  width: 28rpx;
  height: 28rpx;
  margin-right: 4rpx;
}

.like-icon.small {
  width: 24rpx;
  height: 24rpx;
}

.like-count {
  font-size: 24rpx;
  color: #999;
}

.reply-like-count {
  font-size: 22rpx;
  color: #999;
}

.comment-actions,
.reply-actions {
  display: flex;
  align-items: center;
}
</style>
