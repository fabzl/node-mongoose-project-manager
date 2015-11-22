var gulp = require('gulp')
 , sass = require('gulp-ruby-sass')
 , autoprefixer = require('gulp-autoprefixer')
 , minifycss = require('gulp-minify-css')
 , rename = require('gulp-rename')
 , nodemon = require('gulp-nodemon')
 , runSequence = require('run-sequence');

gulp.task('default',['styles','start','express','livereload','watch'], function() {
  // place code for your default task here
  //  runSequence('styles', 'start','livereload');
});
// to run node server
gulp.task('start', function () {
  nodemon({
    script: 'app.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  })
});

// to compile scss
gulp.task('styles', function() {
  return sass('public/stylesheets/sass', { style: 'expanded' })
    .pipe(gulp.dest('public/stylesheets'))
    // .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('public/stylesheets'));
});

// to watch the files
gulp.task('watch', function() {
  gulp.watch('sass/*.scss', ['styles']);
  gulp.watch('*.html', notifyLiveReload);
  gulp.watch('css/*.css', notifyLiveReload);
});

// live reload
gulp.task('express', function() {
  // var express = require('express');
  // var app = express();
  app.use(require('connect-livereload')({port: 35729}));
  app.use(express.static(__dirname));
  app.listen(3000, '127.0.0.1');
});

var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
    tinylr.listen(35729);
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

