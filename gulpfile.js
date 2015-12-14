const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const runSequence = require('run-sequence');
const del = require('del');
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

gulp.task('webpack', cb => {
  webpack(require('./webpack.config'), (err, stats) => {
    if (err) { throw new gutil.PluginError('webpack', err); }
    gutil.log('[webpack]', stats.toString({}));
    cb();
  });
});

gulp.task('webpack:watch', cb => {
  webpack(Object.assign({}, require('./webpack.config'), {
    watch: true,
  }), (err, stats) => {
    if (err) { throw new gutil.PluginError('webpack', err); }
    gutil.log('[webpack]', stats.toString({}));
    cb();
  });
});

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
