'use strict';

var chai = require('chai'),
    expect = chai.expect,
    lazyfs = require('./../index.js'),
    path = require('path'),
    mockfs = require('mock-fs');

describe('lazy-fs', function() {
    before(function() {
        mockfs({
            'test-folder': {
                'path-to-fake-dir': {
                    'some-file.txt': 'file content here',
                    'empty-dir': {/** empty directory */}
                },
                'path-to-some.png': new Buffer([8, 6, 7, 5, 3, 0, 9]),
                'path-to-some.txt': 'file content here',
                'some-other-path': {/** another empty directory */}
            }
        })
    });

    it('should iterate thought files and directives in folder', function(done) {
        try {
            lazyfs.dir('test-folder', { recursive: true })
                .toArray()
                .then(function(files) {
                    try {
                        expect(files).to.have.length(6);
                        expect(files).to.contain(path.join('test-folder', 'path-to-fake-dir'));
                        expect(files).to.contain(path.join('test-folder', 'path-to-some.png'));
                        expect(files).to.contain(path.join('test-folder', 'path-to-some.txt'));
                        expect(files).to.contain(path.join('test-folder', 'some-other-path'));
                        expect(files).to.contain(path.join('test-folder', 'path-to-fake-dir', 'some-file.txt'));
                        expect(files).to.contain(path.join('test-folder', 'path-to-fake-dir', 'empty-dir'));
                        done();
                    } catch(e) {
                        done(e);
                    }
                });
        } catch(e) {
            done(e);
        }
            //use it when Dan Tao will implement A/Promises in AsyncIteration
            //.catch(done);
    });

    it('should recursively iterate thought all files and directives in folder', function(done) {
        try {
            lazyfs.dir('test-folder', { recursive: false })
                .toArray()
                .then(function(files) {
                    try {
                        expect(files).to.have.length(4);
                        expect(files).to.contain(path.join('test-folder', 'path-to-fake-dir'));
                        expect(files).to.contain(path.join('test-folder', 'path-to-some.png'));
                        expect(files).to.contain(path.join('test-folder', 'path-to-some.txt'));
                        expect(files).to.contain(path.join('test-folder', 'some-other-path'));
                        done();
                    } catch(e) {
                        done(e);
                    }
                });
        } catch(e) {
            done(e);
        }
            //use it when Dan Tao will implement A/Promises in AsyncIteration
            //.catch(done);
    });

    it('should filter files', function(done) {
        try {
            lazyfs.dir('test-folder', { recursive: false })
                .filter(lazyfs.fileOnly)
                .async()
                .toArray()
                .then(function(files) {
                    try {
                        expect(files).not.to.be.null;
                        expect(files).not.to.be.undefined;

                        expect(files).to.have.length(2);
                        expect(files).to.contain(path.join('test-folder', 'path-to-some.png'));
                        expect(files).to.contain(path.join('test-folder', 'path-to-some.txt'));
                        done();
                    } catch(e) {
                        done(e);
                    }
                });
        } catch(e) {
            done(e);
        }
            //use it when Dan Tao will implement A/Promises in AsyncIteration
            //.catch(done);
    });

    after(function() {
        mockfs.restore();
    });
});