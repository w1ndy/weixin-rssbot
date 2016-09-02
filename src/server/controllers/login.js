'use strict';

const urljoin = require('url-join');

const conf = require('../config');
const wx = require('../wxapi/weixin');
const dbUserInfo = require('../models/userinfo');

const retrieveAndSaveUserInfo = function (openId, accessToken, refreshToken) {
    return new Promise((resolve, reject) => {
        let userInfo;
        wx.getUserInfo(openId, accessToken)
        .then(info => {
            userInfo = info;
            return wx.getHeadImage(info.headimgurl);
        })
        .then(image => {
            userInfo.headimg = image;
            return dbUserInfo.setUserInfo(accessToken, refreshToken, userInfo);
        })
        .then(() => resolve(userInfo))
        .catch(e => reject(e));
    });
};

exports.handler = function (req, res) {
    if (!req.query.code) {
        res.render('login_error');
    } else {
        let userData;
        wx.getUserBasicData(req.query.code)
        .then(data => {
            userData = data;
            return dbUserInfo.getUserInfo(data.openid);
        })
        .then(info => {
            if (!info) {
                return retrieveAndSaveUserInfo(
                    userData.openid, userData.access_token,
                    userData.refresh_token)
            } else {
                return Promise.resolve(info);
            }
        })
        .then(info => {
            req.session.user = info;
            res.redirect(urljoin(conf.base_url, 'app'));
        })
        .catch(err => {
            console.warn('login failed:', err);
            res.render('login_error');
        });
    }
};
