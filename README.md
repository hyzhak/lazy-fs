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
 * get all 'model.js' in ./modules folder and instantiate them with config
 */

lazyfs.dir(path.join(__dirname, 'modules'))
    .filter(lazyfs.isFile)
    .filter(function(file) {
        return file.name === 'model.js';
    ))
    .each(function(model) {
        //instantiate model
        require(model.path)(config);
    });

```
