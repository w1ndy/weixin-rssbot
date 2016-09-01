'use strict';

const fs = require('fs');

module.exports = JSON.parse(fs.readFileSync('config.json', 'utf8'));

module.exports.saveAccessToken = function (token) {
    return new Promise((resolve, reject) => {
        exports.access_token = token;
        fs.readFile('config.json', 'utf8', (err, data) => {
            if (err)
                return reject('failed to read config: ' + err.toString());
            let conf = JSON.parse(data);
            conf.access_token = token;
            fs.writeFile('config.json', JSON.stringify(conf), (err, data) => {
                if (err)
                    return reject('failed to write config: ' + err.toString());
                resolve();
            });
        });
    })
};
