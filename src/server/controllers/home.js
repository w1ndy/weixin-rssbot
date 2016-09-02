'use strict';

const conf = require('../config');

exports.handler = function (req, res) {
    wx.checkSignature(conf.token, req.query.timestamp,
        req.query.nonce, req.query.signature)
    .then(() => res.send(req.query.echostr))
    .catch(() => res.send('rssbot running'));
};
