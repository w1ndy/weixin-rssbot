const crypto = require('crypto');
const parseXML = require('xml2js').parseString;

const wxmsg = require('./message');

exports.checkSignature = function (token, timestamp, nonce, sign) {
    return new Promise((resolve, reject) => {
        if (!token || !timestamp || !nonce || !sign)
            reject('insufficient params');

        let msg = [token, timestamp, nonce].sort().join(''),
            hash = crypto.createHash('sha1').update(msg).digest('hex');
        if (hash === sign)
            resolve();
        else
            reject('signature check failure');
    });
};

exports.processMessage = function (data) {
    return new Promise((resolve, reject) => {
        parseXML(data, (err, parsed) => {
            if (err)
                return reject(err);
            resolve(new wxmsg.Message(parsed.xml));
        });
    });
};
