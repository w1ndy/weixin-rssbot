'use strict';

exports.handler = function (req, res) {
    res.render('rssbot', { url: req.url });
};
