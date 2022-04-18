function getString(str, firstStr, secondStr) {
    if (str == "" || str == null || str == undefined) { // "",null,undefined
        return "";
    }
    if (str.indexOf(firstStr) < 0) {
        return "";
    }
    var subFirstStr = str.substring(str.indexOf(firstStr) + firstStr.length, str.length);
    var subSecondStr = subFirstStr.substring(0, subFirstStr.indexOf(secondStr));
    return subSecondStr;
}

function getIPAddress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

module.exports = {
    getString,
    getIPAddress
};