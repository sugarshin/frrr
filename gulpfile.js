const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const stream = require('webpack-stream');
const runSequence = require('run-sequence');
const del = require('del');

const syntax = require('postcss-scss');

const $ = require('gulp-load-plugins')({ lazy: false });

const webpackConfig = require('./webpack.config');

const postcssProcessors = [
  require('autoprefixer')({ browsers: ['last 2 version'] }),
  require('css-mqpacker'),
  require('postcss-nested')
];

const assetsPaths = {
  app: './app/assets',
  javascripts: [],
  stylesheets: [],
  images: []
};
const destPath = './public/assets';
const release = process.env.NODE_ENV === 'release';

$.sprockets.declare(assetsPaths, destPath);

// gulp.task('webpack', cb => {
//   webpack(webpackConfig, (err, stats) => {
//     if (err) { throw new gutil.PluginError('webpack', err); }
//     gutil.log('[webpack]', stats.toString({}));
//     cb();
//   });
// });
//
// gulp.task('webpack:watch', cb => {
//   webpack(Object.assign({}, webpackConfig, {
//     watch: true,
//   }), (err, stats) => {
//     if (err) { throw new gutil.PluginError('webpack', err); }
//     gutil.log('[webpack]', stats.toString({}));
//     cb();
//   });
// });

gulp.task('build:image', () => {
  return gulp.src([`${assetsPaths.app}/images/**/*.{jpg,gif,png}`])
    .pipe($.if(release, $.sprockets.precompile()))
    .pipe(gulp.dest(destPath));
});

// gulp.task('build:js', () => {
//   return gulp.src([`${assetsPaths.app}/javascripts/*.js`])
//     .pipe($.sprockets.js())
//     .pipe($.if(release, $.sprockets.precompile()))
//     .pipe(gulp.dest(destPath));
// });

// gulp.task('build:css', () => {
//   return gulp.src([`${assetsPaths.app}/stylesheets/*.css`])
//     .pipe($.cached('css'))
//     .pipe($.sprockets.css({ precompile: release }))
//     .pipe($.if(release, $.sprockets.precompile()))
//     .pipe(gulp.dest(destPath));
// });

gulp.task('clean', cb => {
  del(destPath).then(() => cb());
});

gulp.task('build', () => {
  runSequence('build:image', ['build:css', 'build:js']);
});

gulp.task('build:scss', () => {
  return gulp.src([`${assetsPaths.app}/stylesheets/*.scss`])
    .pipe($.cached('scss'))
    .pipe($.postcss(postcssProcessors, { syntax }))
    .pipe($.sprockets.scss({ precompile: release }))
    .pipe($.if(release, $.sprockets.precompile()))
    .pipe(gulp.dest(destPath))
});

// gulp.task('webpack-dev-server', cb => {
//   const devConfig = Object.create(webpackConfig);
//   devConfig.devtool = 'eval';
//   devConfig.debug = true;
//   devConfig.watch = true;
//
//   new WebpackDevServer(webpack(devConfig), {
//     publicPath: destPath,
//     stats: { colors: true }
//   }).listen(8080, 'localhost', err => {
//     if (err) { throw new gutil.PluginError('webpack-dev-server', err); }
//     gutil.log('[webpack-dev-server]');
//   });
// });

gulp.task('predefault', cb => {
  runSequence(
    'clean',
    // 'webpack-dev-server',
    'webpack:watch',
    ['build:image', 'build:scss'],
    cb
  );
});

gulp.task('webpack', () => {
  console.log(webpackConfig);
  const finalConfig = Object.assign({}, webpackConfig, { watch: true });
  console.log(finalConfig);
  return gulp.src('')
    .pipe(stream(webpackConfig))
    .pipe(gulp.dest(destPath));
});

gulp.task('webpack:watch', () => {
  console.log(webpackConfig);
  const finalConfig = Object.assign({}, webpackConfig, { watch: true });
  console.log(finalConfig);
  return gulp.src('')//`${assetsPaths.app}/javascripts/**/index.ts`
    .pipe(stream(finalConfig))
    .pipe(gulp.dest(destPath));
});

gulp.task('default', ['predefault'], () => {
  gulp.watch(`${assetsPaths.app}/**/*.ts`, ['webpack']);
  // gulp.watch([`${destPath}/**/*.js`], ['build:js'])
  //   .on('change', (e) => {
  //     console.log(`File ${e.path} was ${e.type}, running build task...`);
  //   });
  gulp.watch([`${assetsPaths.app}/stylesheets/**/*.{scss,sass}`], ['build:scss'])
    .on('change', e => {
      console.log(`File ${e.path} was ${e.type}, running build task...`);
    });
});

// gulp.task('watch', () => {
//   gulp.watch(path.ALL, ['webpack']);
// });

// gulp.task('default', ['webpack-dev-server', 'watch']);
