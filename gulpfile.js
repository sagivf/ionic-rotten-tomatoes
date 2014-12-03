var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require("gulp-uglify");

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('templates', function () {
  gulp.src('./www/modules/**/templates/**/*.html')
    .pipe(templateCache({
      module: 'tomatoes',
      root: 'modules'
    }))
    .pipe(gulp.dest('./www/js/public/'));
});

gulp.task('minify-js', function () {
  gulp.src([
      'www/modules/movies/module.js',
      'www/modules/movies/api.srv.js',
      'www/modules/movies/list.ctrl.js',
      'www/modules/movies/item.ctrl.js',
      'www/modules/movies/search.drv.js',
      'www/modules/movies/route.js',

      'www/modules/tomatoes/module.js',
      'www/modules/tomatoes/route.js'
  ])
    .pipe(ngAnnotate())
    .pipe(concat('tomatoes.js'))
    .pipe(gulp.dest('./www/js/public'))
    .pipe(uglify())
    .pipe(rename('tomatoes.min.js'))
    .pipe(gulp.dest('./www/js/public/'));
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
