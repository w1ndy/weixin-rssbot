'use strict';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database/rssbot.db');

exports._database = db;

exports.initialize = function () {
    return new Promise((resolve, reject) => {
        db.run('CREATE TABLE IF NOT EXISTS users (openid PRIMARY KEY, access_token, refresh_token, nickname, sex, province, city, country, headimg)', [], err => {
            if (err)
                return reject(err);
            resolve();
        });
    });
};
