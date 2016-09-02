'use strict';

const wx = require('../wxapi/weixin');

exports.handler = function (req, res) {
    res.redirect(wx.getOauthUrl());
};
