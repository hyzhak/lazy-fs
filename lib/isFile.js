'use strict';

var fs = require('fs');

module.exports = function(file) {
    return file.isFile();
};