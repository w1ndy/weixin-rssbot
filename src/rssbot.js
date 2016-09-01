const express = require('express');
const wx = require('./weixin');
const conf = require('./config');
const bodyParser = require('body-parser');
const parseXML = require('xml2js').parseString;

let app = module.exports = express();

app.use(bodyParser.text({ type: 'text/xml' }));

app.use((req, res, next) => {
    console.log(req.method, req.ip, '=>', req.url);
    next();
});

app.get('/', (req, res) => {
    wx.checkSignature(conf.token, req.query.timestamp,
        req.query.nonce, req.query.signature)
    .then(() => res.send(req.query.echostr))
    .catch(() => res.send('rssbot running'));
});

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
        } else {
            console.warn('unknown event:', evt);
            this.res.send('');
        }
    }
};

app.post('/', (req, res) => {
    wx.checkSignature(conf.token, req.query.timestamp,
        req.query.nonce, req.query.signature)
    .then(() => wx.processMessage(req.body))
    .then(msg => msg.route(new MessageHandlers(req, res)))
    .catch(err => {
        console.err(err.toString());
        res.send('bad request');
    });
});
