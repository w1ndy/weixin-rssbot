'use strict';

const urljoin = require('url-join');

const event = require('./controllers/event');
const authorize = require('./controllers/authorize');
const app = require('./controllers/app');
const login = require('./controllers/login');
const home = require('./controllers/home');

module.exports = function (express) {
    express.get('/', home.handler);
    express.get('/authorize', authorize.handler);
    express.get('/login', login.handler);
    express.get('/app', app.handler);
    express.post('/', event.handler);
};
