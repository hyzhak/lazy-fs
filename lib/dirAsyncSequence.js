'use strict';

var fs = require('fs'),
    path = require('path'),
    Lazy = require('lazy.js');

/**
 *
 * @class DirectoryStreamSequence
 *
 * @param path
 * @param ops
 * @constructor
 */
function DirectoryStreamSequence(path, ops) {
    this.path = path;
    this.ops = ops;
    this.parent = this;
}

DirectoryStreamSequence.prototype = new Lazy.AsyncSequence();
DirectoryStreamSequence.prototype.getIterator = function() {
    return new DirectoryStreamSequenceIterator(this.path, this.ops);
};

/**
 * @class DirectoryStreamSequenceIterator
 * @param path
 * @constructor
 */
function DirectoryStreamSequenceIterator(path, ops) {
    this.path = path;
    this.ops = ops || {
        recursive: true
    };
    
    this.files = [];
    this.directories = [];

    var stat = this.createStat(path);
    if (stat.isDirectory()) {
        this.directories.push(stat);
    }

    this.currentFile = null;
    this.hasParsedRoot = false;
}

DirectoryStreamSequenceIterator.prototype.current = function() {
    return this.currentFile;
};

DirectoryStreamSequenceIterator.prototype._checkFile = function(file) {
    var stat = fs.statSync(file);
    if (stat.isDirectory()) {
        this.directories.push(file);
    }
};

DirectoryStreamSequenceIterator.prototype.createStat = function(root, name) {
    var filePath = name?path.join(root, name):root,
        stat = fs.statSync(filePath);

    stat.path = filePath;
    stat.root = root;
    stat.name = name;
    return stat;
};

DirectoryStreamSequenceIterator.prototype.moveNext = function() {
    var self = this,
        file;

    if (this.files.length === 0 && (this.ops.recursive || !this.hasParsedRoot)) {
        this.hasParsedRoot = true;
        var root = this.directories.pop();
        if (root) {
            append(self.files,
                fs.readdirSync(root.path)
                    .map(function(fileName) {
                        return self.createStat(root.path, fileName);
                    })
            );
        }
    }

    if (this.files.length > 0) {
        file = this.files.pop();
        if (file.isDirectory()) {
            this.directories.push(file);
        }
    } else {
        return false;
    }

    this.currentFile = file;
    return true;
};

module.exports = function(path, ops) {
    return new DirectoryStreamSequence(path, ops)
};

function append(array, source) {
    Array.prototype.push.apply(array, source);
    return array;
}