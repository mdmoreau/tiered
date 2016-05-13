var bs = require('browser-sync');
var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('html', function() {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('dist'))
    .on('end', bs.reload);
});

gulp.task('sass', function() {
  return gulp.src('src/sass/tiered.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))
    .pipe(bs.stream());
});

gulp.task('js', function() {
  return gulp.src('src/js/tiered.js')
    .pipe(gulp.dest('dist/js'))
    .on('end', bs.reload);
});

gulp.task('bs', function() {
  return bs.init({
    server: 'dist'
  });
});

gulp.task('watch', function() {
  gulp.watch('src/index.html', gulp.registry().get('html'));
  gulp.watch('src/sass/tiered.scss', gulp.registry().get('sass'));
  gulp.watch('src/js/tiered.js',gulp.registry().get('js'));
});

gulp.task('default', gulp.series(gulp.parallel('html', 'sass', 'js'), gulp.parallel('bs', 'watch')));
