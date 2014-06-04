'use strict';

var mkdirp = require('mkdirp');
var path = require('path');
var bust = require('gulp-buster');
var fs = require('fs');

module.exports = function hash(gulp, conf) {
  conf = conf || {};
  conf.gwd = conf.gwd || process.cwd();

  return function(cb) {
    cb = cb || function() {};

    bust.config({
      algo: 'md5',
      length: 7
    });
    gulp.src(['**/*.*'], {
      cwd: conf.cwd
    })
      .pipe(bust(path.relative(conf.gwd, conf.hash)))
      .pipe(gulp.dest('.'))
      .on('end', function() {
        var hashFile = conf.hash;
        var hash = require(hashFile);
        var hashMap = {};
        if (conf.mapping === 'dev') {
          Object.keys(hash).forEach(function(c) {
            hashMap['/' + c] = '/' + c;
          });
        } else {
          Object.keys(hash).forEach(function(c) {
            hashMap['/' + c] = '/' + c.substr(0, (c.length - path.extname(c).length)) + '.' + hash[c] + path.extname(c);
          });
        }
        fs.writeFileSync(hashFile, JSON.stringify(hashMap, 0, 2));
        var hashes = Object.keys(hashMap);
        if (hashes.length) {
          hashes.forEach(function(c) {
            mkdirp.sync(path.dirname(path.join(conf.output, hashMap[c])));
            return fs.createReadStream(path.join(conf.cwd, c)).pipe(fs.createWriteStream(path.join(conf.output, hashMap[c])));
          });
        }
        cb();
      });
  };

};
