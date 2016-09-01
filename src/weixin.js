const crypto = require('crypto');

exports.checkSignature = function (token, timestamp, nonce, sign) {
    let msg = [token, timestamp, nonce].sort().join(''),
        hash = crypto.createHash('sha1').update(msg).digest('hex');
    return hash == sign;
};
