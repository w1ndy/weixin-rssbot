'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const db = require('./models/database');
const menu = require('./wxapi/menu');
const route = require('./route');
const conf = require('./config');

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
app.set('views', 'src/server/views');

app.use(session({
    secret: conf.app_secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(bodyParser.text({
    type: 'text/xml'
}));

app.use((req, res, next) => {
    console.log(req.method, req.ip, '=>', req.url);
    next();
});

app.use('/src/client', express.static('src/client'));
app.use('/public', express.static('public'));

route(app);
