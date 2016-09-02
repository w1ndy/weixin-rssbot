'use strict';

const request = require('request');
const urljoin = require('url-join');

const conf = require('../config');
const wx = require('./weixin');

exports.createMenu = function () {
    return wx.postAPI('/menu/create', {
        button: [
            {
                name: '状态',
                type: 'click',
                key: 'get_rss_status'
            },
            {
                name: '打开RSSbot',
                type: 'view',
                url: urljoin(conf.base_url, 'authorize')
            }
        ]
    });
};
