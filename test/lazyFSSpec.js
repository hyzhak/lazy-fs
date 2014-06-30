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

    it('should iterate thought files and directives in folder', function() {
        var files = lazyfs
            .dir('test-folder', { recursive: true })
            .toArray();

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
    });

    it('should recursively iterate thought all files and directives in folder', function() {
        var files = lazyfs
            .dir('test-folder', { recursive: false })
            .toArray();

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
    });

    it('should filter files', function() {
        var files = lazyfs.dir('test-folder', { recursive: false })
            .filter(lazyfs.isFile)
            .toArray();

        expect(files).to.have.length(2);

        expect(files[0]).to.have.property('name', 'path-to-some.txt');
        expect(files[0]).to.have.property('root', 'test-folder');
        expect(files[0]).to.have.property('path', path.join('test-folder', 'path-to-some.txt'));

        expect(files[1]).to.have.property('name', 'path-to-some.png');
        expect(files[1]).to.have.property('root', 'test-folder');
        expect(files[1]).to.have.property('path', path.join('test-folder', 'path-to-some.png'));
    });

    after(function() {
        mockfs.restore();
    });
});