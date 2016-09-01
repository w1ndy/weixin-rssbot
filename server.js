const https = require('https');
const fs = require('fs');
const color = require('cli-color');
const rssbot = require('./src/rssbot');

const colorMap = {
    log: color.green,
    warn: color.yellow,
    error: color.red
};

Object.keys(colorMap).forEach(fn => {
    let pf = console[fn];
    console[fn] = function () {
        pf.apply(console,
            [colorMap[fn](new Date().toLocaleString())]
            .concat([].slice.call(arguments)));
    };
});

const httpsOptions = {
    key: fs.readFileSync('cert/key.pem'),
    cert: fs.readFileSync('cert/cert.pem')
};

https
.createServer(httpsOptions, rssbot)
.listen(443, err => {
    if (err) {
        console.error(err.toString());
        process.exit(1);
    }
    console.log('rssbot running at port 443... Press Ctrl+C to stop.');
});
