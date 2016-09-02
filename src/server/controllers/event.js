'use strict';

const wx = require('../wxapi/weixin');
const conf = require('../config');

class MessageHandlers {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
    text(msg, content) {
        console.log('received message:', msg.content);
        this.res.send('');
    }
    event(msg, evt, evtkey) {
        if (evt === 'subscribe') {
            console.log('subscribed:', msg.user);
            this.res.send('');
        } else if (evt === 'unsubscribe') {
            console.log('unsubscribed:', msg.user);
            this.res.send('');
        } else if (evt === 'CLICK') {
            console.log('menu clicked:', evtkey);
            this.res.send('');
        } else if (evt === 'VIEW') {
            console.log('menu viewed:', evtkey);
            this.res.send('');
        } else {
            console.warn('unknown event:', evt);
            this.res.send('');
        }
    }
};

exports.handler = function (req, res) {
    wx.checkSignature(conf.token, req.query.timestamp,
        req.query.nonce, req.query.signature)
    .then(() => wx.processMessage(req.body))
    .then(msg => msg.route(new MessageHandlers(req, res)))
    .catch(err => {
        console.err(err.toString());
        res.send('bad request');
    });
};
