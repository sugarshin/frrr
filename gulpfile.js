const gulp = require('gulp');
const runSequence = require('run-sequence');
const $ = require('gulp-load-plugins')({ lazy: false });

const assetsPaths = {
  app: './app/assets',
  javascripts: ['application.js'],
  stylesheets: ['application.scss'],
  images: []
};
const destPath = './public/assets';
const release = process.env.NODE_ENV === 'release';

$.sprockets.declare(assetsPaths, destPath);

gulp.task('build:image', () => {
  return gulp.src([`${assetsPaths.app}/images/**/*.png`])
    .pipe($.if(release, $.sprockets.precompile()))
    .pipe(gulp.dest(destPath));
});

gulp.task('build:js', () => {
  return gulp.src([`${assetsPaths.app}/javascripts/*.js`])
    .pipe($.sprockets.js())
    .pipe($.if(release, $.sprockets.precompile()))
    .pipe(gulp.dest(destPath));
});

gulp.task('build:css', () => {
  return gulp.src([`${assetsPaths.app}/stylesheets/*.scss`])
    .pipe($.cached('css'))
    .pipe($.sprockets.css({ precompile: release }))
    .pipe($.if(release, $.sprockets.precompile()))
    .pipe(gulp.dest(destPath));
});

gulp.task('build', () => {
  runSequence('build:image', ['build:css', 'build:js']);
});
