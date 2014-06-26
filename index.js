'use strict';

var mkdirp = require('mkdirp');
var path = require('path');
var bust = require('gulp-buster');
var fs = require('fs');
var minimatch = require('minimatch');

module.exports = function hash(gulp, conf, callback) {
  conf = conf || {};
  conf.gwd = conf.gwd || process.cwd();
  conf.glob = conf.glob || '**/*.*';
  conf.symbol = conf.symbol || '.';
  conf.preservePath = conf.preservePath || true;
  conf.md5Length = conf.md5Length || 7;

  if (conf.copy) {
    if (typeof conf.copy === 'string') {
      conf.copy = [conf.copy];
    }
  }

  function copyMatch(asset) {
    var match = false;
    if (!conf.copy) {
      return false;
    }
    conf.copy.forEach(function(glob) {
      if (minimatch(asset, glob)) {
        match = true;
      }
    });
    return match;
  }

  return function(cb) {
    cb = callback || function() {};

    bust.config({
      algo: 'md5',
      length: conf.md5Length
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
          if (conf.mapping === 'dev' || copyMatch(c)) {
            hashMap['/' + c] = '/' + c;
          } else {
            var loc = '/';
            if (conf.preservePath) {
              loc += c.substr(0, (c.length - path.extname(c).length)) + conf.symbol + hash[c] + path.extname(c);
            } else {
              loc += hash[c] + path.extname(c);
              // split into a 2 char length leading subdirectory
              loc = loc.substr(0, 3) + '/' + loc.substr(3);
            }
            hashMap['/' + c] = loc;
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
            fs.writeFileSync(path.join(conf.output, hashMap[c]), fs.readFileSync(path.join(conf.cwd, c)));
          });
        }
        cb();
      });
  };
};
