'use strict';

var Lazy = require('lazy.js');

module.exports = {
    /**
     * lazy.js async sequence for directory
     *
     * @param: path to root
     * @param: ops {recursive - is going deep inside}
     */
    dir: require('./dirAsyncSequence.js'),

    /**
     * helper function to filter files by only file left:
     *
     * @example:
     *
     * lazyfs.dir(path.join(__dirname, 'modules'))
     *     .filter(lazyfs.isFile)
     *
     */
    isFile: require('./isFile.js')
};