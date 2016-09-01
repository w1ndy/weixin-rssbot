'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const db = require('./database');
const menu = require('./menu');
const route = require('./route');

let app = module.exports = express();

db.initialize()
.then(() => console.log('database initialized.'))
.catch(e => {
    console.error('failed to initialize database:', e);
    process.exit();
});

menu.createMenu()
.then(() => console.log('menu created.'))
.catch(e => console.error('failed to create menu:', e));

app.set('view engine', 'ejs');

app.use(bodyParser.text({ type: 'text/xml' }));

app.use((req, res, next) => {
    console.log(req.method, req.ip, '=>', req.url);
    next();
});

route(app);
