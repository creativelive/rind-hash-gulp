'use strict';

var hash = require('..');
var path = require('path');
var gulp = require('gulp');
var fs = require('fs');

module.exports = function(gulp, conf) {
  var mapping = conf.args.mapping || 'prod';
  var opts = {
    cwd: path.join(conf.gwd, 'test', 'src'),
    output: path.join(conf.gwd, 'test', 'out'),
    hash: path.join(conf.gwd, 'test', 'out', 'hash.json'),
    copy: '**/*.txt',
    mapping: mapping,
    verbose: true
  };

  gulp.task('hash', ['clean'], hash(gulp, opts));

  gulp.task('test', ['hash'], function() {
    var expected = {
      dev: {
        '/img/rind.png': '/img/rind.png',
        '/js/hello.js': '/js/hello.js',
        '/txt/sample.txt': '/txt/sample.txt'
      },
      prod: {
        '/img/rind.png': '/img/rind.d6bc63f.png',
        '/js/hello.js': '/js/hello.d81ffe3.js',
        '/txt/sample.txt': '/txt/sample.txt'
      }
    };
    expected = expected[mapping];
    var hashFile = require(opts.hash);
    for (var i in expected) {
      if (!fs.existsSync(path.join(opts.output, expected[i]))) {
        gulp.fail = true;
      }
      if (expected[i] !== hashFile[i]) {
        gulp.fail = true;
      }
    }
    if (gulp.fail !== true) {
      console.log('assets successfully [' + mapping + '] mapped and created');
    }
  });
};
