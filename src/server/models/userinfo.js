'use strict';

const dbmgr = require('./database');
const db = dbmgr._database;

exports.getUserInfo = function (openId) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('SELECT * FROM users WHERE openid = ?');
        stmt.all(openId, (err, rows) => {
            if (err)
                return reject(err);
            if (!rows.length)
                return resolve(undefined);
            resolve(rows[0]);
        });
    });
};

exports.setUserInfo = function (accessToken, refreshToken, userInfo) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        stmt.run(userInfo.openid, accessToken, refreshToken,
            userInfo.nickname, userInfo.sex, userInfo.province,
            userInfo.city, userInfo.country, userInfo.headimg,
            err => {
                if (err)
                    return reject(err);
                resolve();
            });
    });
};
