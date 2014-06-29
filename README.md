lazy-fs
=======

[![Build Status](https://travis-ci.org/Hyzhak/lazy-fs.svg)](https://travis-ci.org/Hyzhak/lazy-fs)

Extension to add to file system functional syntax. [Lazy.js](https://github.com/dtao/lazy.js) under the hood.

# Installation
```
$ npm install lazy-fs --save
```

# Example
```javascript

var lazyfs = require('lazy-fs');

/**
 * get all 'model.js' in ./modules folder and instanticate them with config
 */

lazyfs.dir(path.join(__dirname, 'modules'))
    .filter(lazyfs.isFile)
    .filter(function(file) {
        return file.name === 'model.js';
    ))
    .async() //hack because right now AsyncSequence doesn't have filter function 
    .each(function(model) {
        //instantiate model
        require(model.path)(config);
    });

```
