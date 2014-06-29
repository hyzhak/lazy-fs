'use strict';

var fs = require('fs');

module.exports = function(filePath) {
    return fs.statSync(filePath).isFile();
};