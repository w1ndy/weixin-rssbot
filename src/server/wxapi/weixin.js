'use strict';

const crypto = require('crypto');
const request = require('request');
const parseXML = require('xml2js').parseString;
const urljoin = require('url-join');

const wxmsg = require('./message');
const conf = require('../config');

exports.checkSignature = function (token, timestamp, nonce, sign) {
    return new Promise((resolve, reject) => {
        if (!token || !timestamp || !nonce || !sign)
            reject('insufficient params');

        let msg = [token, timestamp, nonce].sort().join(''),
            hash = crypto.createHash('sha1').update(msg).digest('hex');
        if (hash === sign)
            resolve();
        else
            reject('signature check failure');
    });
};

exports.processMessage = function (data) {
    return new Promise((resolve, reject) => {
        parseXML(data, (err, parsed) => {
            if (err)
                return reject(err);
            resolve(new wxmsg.Message(parsed.xml));
        });
    });
};

exports.getAccessToken = function () {
    if (conf.access_token)
        return Promise.resolve(conf.access_token);
    else
        return exports.updateAccessToken();
};

exports.updateAccessToken = function () {
    return new Promise((resolve, reject) => {
        request.get({
            url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${conf.app_id}&secret=${conf.app_secret}`,
            json: true
        }, (err, resp, body) => {
            if (err)
                return reject('retrieve access token error: '
                    + err.toString());
            if (resp.statusCode !== 200)
                return reject('retrieve access token error: '
                    + resp.statusCode.toString());
            if (body.errcode)
                return reject('retrieve access token error: '
                    + body.errmsg);
            conf.saveAccessToken(body.access_token);
            resolve(body.access_token);
        });
    });
};

var _postAPICore = function (api, req, token) {
    return new Promise((resolve, reject) => {
        console.log(`posting https://api.weixin.qq.com/cgi-bin${api}?access_token=ACCESS_TOKEN`);
        request.post({
            url: `https://api.weixin.qq.com/cgi-bin${api}?access_token=${token}`,
            json: true,
            body: req
        }, (err, resp, body) => {
            if (err)
                return reject('post api failed: ' + err);
            if (resp.statusCode !== 200)
                return reject('post api failed: ' + resp.statusCode);
            if (body.errcode === 42001)
                return reject('retry');
            if (body.errcode !== 0)
                return reject('post api failed: ' + body.errmsg);
            resolve(body);
        });
    });
};

exports.postAPI = function (api, req) {
    return new Promise((resolve, reject) => {
        exports.getAccessToken()
        .then(token => _postAPICore(api, req, token))
        .then(result => resolve(result))
        .catch(e => {
            if (e === 'retry') {
                exports.updateAccessToken()
                .then(token => _postAPICore(api, req, token))
                .then(result => resolve(result))
                .catch(f => reject(f))
            } else {
                reject(e);
            }
        });
    });
};

exports.getOauthUrl = function () {
    let returl = encodeURIComponent(urljoin(conf.base_url, '/login'));
    console.log('redirecting to oauth2...');
    return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${conf.app_id}&redirect_uri=${returl}&response_type=code&scope=snsapi_userinfo#wechat_redirect`;
};

exports.getUserBasicData = function (code) {
    return new Promise((resolve, reject) => {
        request.get({
            url: `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${conf.app_id}&secret=${conf.app_secret}&code=${code}&grant_type=authorization_code`,
            json: true
        }, (err, resp, body) => {
            if (err)
                return reject(err);
            if (resp.statusCode !== 200)
                return reject(resp.statusCode.toString());
            if (body.errcode && body.errcode !== 0)
                return reject(body.errmsg);
            resolve(body);
        });
    });
};

exports.getUserInfo = function (openId, accessToken) {
    return new Promise((resolve, reject) => {
        console.log(`https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openId}&lang=zh_CN`);
        request.get({
            url: `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openId}&lang=zh_CN`,
            json: true
        }, (err, resp, body) => {
            if (err)
                return reject(err);
            if (resp.statusCode !== 200)
                return reject(resp.statusCode.toString());
            if (body.errcode && body.errcode !== 0)
                return reject(body.errmsg);
            resolve(body);
        });
    });
};

exports.getHeadImage = function (url) {
    return new Promise((resolve, reject) => {
        request.get({
            url: url,
            encoding: null
        }, (err, resp, body) => {
            if (err)
                return reject(err);
            if (resp.statusCode !== 200)
                return reject(resp.statusCode.toString());
            const b64data = new Buffer(body).toString('base64');
            resolve(`data:${resp.headers['content-type']};base64,${b64data}`);
        });
    });
};
