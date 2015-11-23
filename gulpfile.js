var gulp = require('gulp')
 , sass = require('gulp-ruby-sass')
 , autoprefixer = require('gulp-autoprefixer')
 , minifycss = require('gulp-minify-css')
 , rename = require('gulp-rename')
 , nodemon = require('gulp-nodemon')
 , runSequence = require('run-sequence')
 , browserSync = require('browser-sync').create();


gulp.task('default',['styles','start','watch','browser-sync'], function() {
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
  
    gulp.watch('public/stylesheets/sass/*.scss', ['styles']);
  // gulp.watch('*.html', notifyLiveReload);
   // gulp.watch("public/**/*.*", browserSync.reload);
//  gulp.watch('*.html', browserSync.reload);
//  gulp.watch('css/*.css', browserSync.reload);
  // gulp.watch("app/scss/*.scss", ['sass']);
   gulp.watch("public/**/*.*").on('change', browserSync.reload);

});


// Static server
// gulp.task('browser-sync', function() {
//     browserSync.init({
//         proxy: '127.0.0.1:3000'
//     });
// });

// or...

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "localhost:3000",
        files: ["public/**/*.*"],
        port: 8000
    });
});

