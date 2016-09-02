'use strict';

const fs = require('fs');
const path = require('path');
const glob = require('glob');

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

module.exports.clientDependencies = {
    css: [
        '/src/client/stylesheets/*.css'
    ],
    js: [
        'https://res.wx.qq.com/open/js/jweixin-1.0.0.js',
        '/public/lib/angular/angular.min.js',
        '/public/lib/angular-ui-router/release/angular-ui-router.min.js',
        '/src/client/config.js'
    ]
};

(function () {
    const expandGlobbedDependency = function (depArray, globbedDependency) {
        const pattern = path.posix.join('.', globbedDependency);
        glob(pattern, (err, fnames) => {
            if (err || !fnames.length) {
                console.error('unable to resolve dependency:', pattern);
                return;
            }
            const pos = depArray.indexOf(globbedDependency);
            depArray.splice(pos, 1, ... fnames);
        });
    };

    const checkGlobbedDependency = function (depArray) {
        for (const fname of depArray) {
            if (fname.indexOf('*') >= 0)
                expandGlobbedDependency(depArray, fname);
        }
    };

    checkGlobbedDependency(module.exports.clientDependencies.css);
    checkGlobbedDependency(module.exports.clientDependencies.js);
}());
