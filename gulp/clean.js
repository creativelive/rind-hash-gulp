'use strict';

var rimraf = require('rimraf');

module.exports = function(gulp, conf) {
  // clean the workspace
  gulp.task('clean', function(cb) {
    rimraf(conf.build.get('/clean'), cb);
  });
};
