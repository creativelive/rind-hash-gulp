'use strict';

var mkdirp = require('mkdirp');
var path = require('path');
var bust = require('gulp-buster');
var fs = require('fs');
var minimatch = require('minimatch');

module.exports = function hash(gulp, conf) {
  conf = conf || {};
  conf.gwd = conf.gwd || process.cwd();
  conf.glob = conf.glob || '**/*.*';
  conf.symbol = conf.symbol || '.';

  return function(cb) {
    cb = cb || function() {};

    bust.config({
      algo: 'md5',
      length: 7
    });
    gulp.src(conf.glob, {
      cwd: conf.cwd
    })
      .pipe(bust(path.relative(conf.gwd, conf.hash)))
      .pipe(gulp.dest('.'))
      .on('end', function() {
        var hash;
        try {
          hash = require(conf.hash);
          delete require.cache[conf.hash];
        } catch (e) {
          hash = {};
        }
        var hashMap = {};

        Object.keys(hash).forEach(function(c) {
          if (conf.mapping === 'dev' || (conf.copy && minimatch(c, conf.copy))) {
            hashMap['/' + c] = '/' + c;
          } else {
            hashMap['/' + c] = '/' + c.substr(0, (c.length - path.extname(c).length)) + conf.symbol + hash[c] + path.extname(c);
          }
        });

        fs.writeFileSync(conf.hash, JSON.stringify(hashMap, 0, 2));
        var hashes = Object.keys(hashMap);
        if (hashes.length) {
          hashes.forEach(function(c) {
            if (conf.verbose) {
              console.log(hashMap[c]);
            }
            mkdirp.sync(path.dirname(path.join(conf.output, hashMap[c])));
            fs.createReadStream(path.join(conf.cwd, c)).pipe(fs.createWriteStream(path.join(conf.output, hashMap[c])));
          });
        }
        cb();
      });
  };
};
