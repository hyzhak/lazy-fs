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

//TODO: current implementation of lazy.js doesn't have sortBy for AsyncSequence
//                .sortBy(lazyfs.nameOfFile)
                .toArray()
                .then(function(files) {
                    try {
                        expect(files).to.have.length(6);

                        expect(files[0]).to.have.property('name', 'some-other-path');
                        expect(files[0]).to.have.property('root', 'test-folder');
                        expect(files[0]).to.have.property('path', path.join('test-folder', 'some-other-path'));

                        expect(files[1]).to.have.property('name', 'path-to-some.txt');
                        expect(files[1]).to.have.property('root', 'test-folder');
                        expect(files[1]).to.have.property('path', path.join('test-folder', 'path-to-some.txt'));

                        expect(files[2]).to.have.property('name', 'path-to-some.png');
                        expect(files[2]).to.have.property('root', 'test-folder');
                        expect(files[2]).to.have.property('path', path.join('test-folder', 'path-to-some.png'));

                        expect(files[3]).to.have.property('name', 'path-to-fake-dir');
                        expect(files[3]).to.have.property('root', 'test-folder');
                        expect(files[3]).to.have.property('path', path.join('test-folder', 'path-to-fake-dir'));

                        expect(files[4]).to.have.property('name', 'some-file.txt');
                        expect(files[4]).to.have.property('root', path.join('test-folder', 'path-to-fake-dir'));
                        expect(files[4]).to.have.property('path', path.join('test-folder', 'path-to-fake-dir', 'some-file.txt'));

                        expect(files[5]).to.have.property('name', 'empty-dir');
                        expect(files[5]).to.have.property('root', path.join('test-folder', 'path-to-fake-dir'));
                        expect(files[5]).to.have.property('path', path.join('test-folder', 'path-to-fake-dir', 'empty-dir'));

                        done();
                    } catch(e) {
                        done(e);
                    }
                });
        } catch(e) {
            done(e);
        }
        //TODO: use it when Dan Tao will implement A/Promises in AsyncIteration
        //.catch(done);
    });

    it('should recursively iterate thought all files and directives in folder', function(done) {
        try {
            lazyfs.dir('test-folder', { recursive: false })
                .toArray()
                .then(function(files) {
                    try {
                        expect(files).to.have.length(4);

                        expect(files[0]).to.have.property('name', 'some-other-path');
                        expect(files[0]).to.have.property('root', 'test-folder');
                        expect(files[0]).to.have.property('path', path.join('test-folder', 'some-other-path'));

                        expect(files[1]).to.have.property('name', 'path-to-some.txt');
                        expect(files[1]).to.have.property('root', 'test-folder');
                        expect(files[1]).to.have.property('path', path.join('test-folder', 'path-to-some.txt'));

                        expect(files[2]).to.have.property('name', 'path-to-some.png');
                        expect(files[2]).to.have.property('root', 'test-folder');
                        expect(files[2]).to.have.property('path', path.join('test-folder', 'path-to-some.png'));

                        expect(files[3]).to.have.property('name', 'path-to-fake-dir');
                        expect(files[3]).to.have.property('root', 'test-folder');
                        expect(files[3]).to.have.property('path', path.join('test-folder', 'path-to-fake-dir'));
                        done();
                    } catch(e) {
                        done(e);
                    }
                });
        } catch(e) {
            done(e);
        }
        //TODO: use it when Dan Tao will implement A/Promises in AsyncIteration
        //.catch(done);
    });

    it('should filter files', function(done) {
        try {
            lazyfs.dir('test-folder', { recursive: false })
                .filter(lazyfs.isFile)
                .async()
                .toArray()
                .then(function(files) {
                    try {
                        expect(files).to.have.length(2);

                        expect(files[0]).to.have.property('name', 'path-to-some.txt');
                        expect(files[0]).to.have.property('root', 'test-folder');
                        expect(files[0]).to.have.property('path', path.join('test-folder', 'path-to-some.txt'));

                        expect(files[1]).to.have.property('name', 'path-to-some.png');
                        expect(files[1]).to.have.property('root', 'test-folder');
                        expect(files[1]).to.have.property('path', path.join('test-folder', 'path-to-some.png'));

                        done();
                    } catch(e) {
                        done(e);
                    }
                });
        } catch(e) {
            done(e);
        }
        //TODO: use it when Dan Tao will implement A/Promises in AsyncIteration
        //.catch(done);
    });

    after(function() {
        mockfs.restore();
    });
});