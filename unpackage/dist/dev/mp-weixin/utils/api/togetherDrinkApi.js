"use strict";
const utils_request = require("../request.js");
const createInvitation = (data) => {
  return utils_request.request({
    url: "/api/together-drink/invitations",
    method: "POST",
    data
  }).then((response) => {
    return response;
  }).catch((error) => {
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
  return utils_request.request({
    url: `/api/together-drink/invitations/${invitationId}/join`,
    method: "POST",
    data,
    loading: true,
    loadingText: "正在加入邀请..."
  }).then((response) => {
    return response;
  }).catch((error) => {
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
