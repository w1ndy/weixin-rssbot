const express = require('express');
const wx = require('./weixin');
const conf = require('./config');

let app = module.exports = express();

app.use((req, res, next) => {
    console.log(req.ip, '=>', req.url);
    next();
});

app.get('/', (req, res) => {
    if (req.query.timestamp && req.query.nonce && req.query.signature &&
            wx.checkSignature(conf.token, req.query.timestamp,
                req.query.nonce, req.query.signature)) {
        res.send(req.query.echostr);
        console.log('signature has been verified.');
    }
    res.send('rssbot running');
});
