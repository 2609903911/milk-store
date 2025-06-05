package com.milkstore.entity;

import java.util.Date;

/**
 * 用户关注关系实体类
 */
public class UserFollow {
    
    /**
     * 主键ID
     */
    private Long id;
    
    /**
     * 关注者ID
     */
    private String followerId;
    
    /**
     * 被关注者ID
     */
    private String followedId;
    
    /**
     * 关注时间
     */
    private Date createTime;
    
    /**
     * 状态：1-有效，0-无效
     */
    private Integer status;
    
    /**
     * 关注者用户信息（非数据库字段，用于关联查询）
     */
    private User follower;
    
    /**
     * 被关注者用户信息（非数据库字段，用于关联查询）
     */
    private User followed;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFollowerId() {
        return followerId;
    }

    public void setFollowerId(String followerId) {
        this.followerId = followerId;
    }

    public String getFollowedId() {
        return followedId;
    }

    public void setFollowedId(String followedId) {
        this.followedId = followedId;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public User getFollower() {
        return follower;
    }

    public void setFollower(User follower) {
        this.follower = follower;
    }

    public User getFollowed() {
        return followed;
    }

    public void setFollowed(User followed) {
        this.followed = followed;
    }

    @Override
    public String toString() {
        return "UserFollow{" +
                "id=" + id +
                ", followerId='" + followerId + '\'' +
                ", followedId='" + followedId + '\'' +
                ", createTime=" + createTime +
                ", status=" + status +
                '}';
    }
} 