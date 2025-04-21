"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../request.js");
const createInvitation = (data) => {
  common_vendor.index.__f__("log", "at utils/api/togetherDrinkApi.js:16", "【创建邀请】请求数据:", JSON.stringify(data, null, 2));
  return utils_request.request({
    url: "/api/together-drink/invitations",
    method: "POST",
    data
  }).then((response) => {
    common_vendor.index.__f__("log", "at utils/api/togetherDrinkApi.js:22", "【创建邀请】成功响应:", JSON.stringify(response, null, 2));
    return response;
  }).catch((error) => {
    common_vendor.index.__f__("error", "at utils/api/togetherDrinkApi.js:25", "【创建邀请】错误响应:", error);
    throw error;
  });
};
const getInvitationById = (invitationId) => {
  return utils_request.request({
    url: `/api/together-drink/invitations/${invitationId}`,
    method: "GET"
  });
};
const getInvitationByCode = (inviteCode) => {
  return utils_request.request({
    url: `/api/together-drink/invitations/code/${inviteCode}`,
    method: "GET"
  });
};
const joinInvitation = (invitationId, data) => {
  common_vendor.index.__f__("log", "at utils/api/togetherDrinkApi.js:62", "【加入邀请】开始请求，邀请ID:", invitationId, "请求数据:", JSON.stringify(data));
  return utils_request.request({
    url: `/api/together-drink/invitations/${invitationId}/join`,
    method: "POST",
    data,
    loading: true,
    loadingText: "正在加入邀请..."
  }).then((response) => {
    common_vendor.index.__f__("log", "at utils/api/togetherDrinkApi.js:70", "【加入邀请】成功响应:", JSON.stringify(response));
    return response;
  }).catch((error) => {
    common_vendor.index.__f__("error", "at utils/api/togetherDrinkApi.js:73", "【加入邀请】请求失败:", error);
    throw error;
  });
};
const cancelInvitation = (invitationId, data) => {
  return utils_request.request({
    url: `/api/together-drink/invitations/${invitationId}/cancel`,
    method: "PUT",
    data
  });
};
const completeInvitation = (invitationId, data) => {
  return utils_request.request({
    url: `/api/together-drink/invitations/${invitationId}/complete`,
    method: "POST",
    data
  });
};
exports.cancelInvitation = cancelInvitation;
exports.completeInvitation = completeInvitation;
exports.createInvitation = createInvitation;
exports.getInvitationByCode = getInvitationByCode;
exports.getInvitationById = getInvitationById;
exports.joinInvitation = joinInvitation;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/api/togetherDrinkApi.js.map
