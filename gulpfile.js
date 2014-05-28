'use strict';

var gulp = require('gulp')
  , browserify = require('browserify')
  , exorcist = require('exorcist')
  , mold = require('mold-source-map')
  , source = require('vinyl-source-stream')
  , path = require('path')
  , jsRoot = path.join(__dirname, 'lib')
  ;

function debugBuild() {
  return browserify('./lib/sockjs.js')
    .bundle({
      standalone: 'SockJS'
    , debug: true
    })
    .pipe(mold.transformSourcesRelativeTo(jsRoot))
    .pipe(exorcist(path.join(__dirname, 'build/sockjs.js.map')))
    .pipe(source('sockjs.js'))
    .pipe(gulp.dest('./build/'))
    ;
}

gulp.task('default', function() {

});

gulp.task('test', function() {
  debugBuild()
    .pipe(gulp.dest('./tests/html/lib/'))
    ;

  browserify('./tests/html/lib/alltests.js')
    .bundle()
    .pipe(source('alltestsbundle.js'))
    .pipe(gulp.dest('./tests/html/lib/'))
    ;
});

gulp.task('browserify', debugBuild);

gulp.task('browserify:min', function () {
  return browserify('./lib/sockjs.js')
    .plugin('minifyify', {
      map: 'sockjs.min.js.map'
    , compressPath: jsRoot
    , output: './build/sockjs.min.js.map'
    })
    .bundle({
      standalone: 'SockJS'
    })
    .pipe(source('sockjs.min.js'))
    .pipe(gulp.dest('./build/'))
    ;
});