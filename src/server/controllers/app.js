'use strict';

const conf = require('../config.js');

exports.handler = function (req, res) {
    res.render('rssbot', {
        cssFiles: conf.clientDependencies.css,
        jsFiles: conf.clientDependencies.js,
        openid: req.session.user ? req.session.user.openid : 'not logged in'
    });
};
