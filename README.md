# [![rind](https://raw.githubusercontent.com/creativelive/rind/master/assets/rind-32.png)](https://github.com/creativelive/rind) rind-hash-gulp [![](https://travis-ci.org/creativelive/rind-hash-gulp.svg)](https://travis-ci.org/creativelive/rind-hash-gulp)

Gulp tasks to generate an md5 mapped directory of assets.

Given filesystem input:
```
├── img
│   └── rind.png
├── js
│   └── hello.js
└── txt
    └── sample.txt
```

Produces:
```
├── hash.json
├── img
│   └── rind.d6bc63f.png
├── js
│   └── hello.d81ffe3.js
└── txt
    └── sample.6f5902a.txt
```

Where `hash.json` will contain the mapping from original filename to md5'd version:

```
{
  "/img/rind.png": "/img/rind.d6bc63f.png",
  "/js/hello.js": "/js/hello.d81ffe3.js",
  "/txt/sample.txt": "/txt/sample.6f5902a.txt"
}
```

## Usage

```
var gulp = require('gulp');
var hash = require('rind-hash-gulp');

/*
var opts = {
  cwd: // directory to glob
  output: // output directory
  hash: // path and filename for hash.json
  mapping: // if set to `dev` then hash.json will point to original files
  verbose: // output process
};
*/

gulp.task('hash', hash(gulp, opts));
```
