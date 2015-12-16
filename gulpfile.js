const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync');
const del = require('del');
const syntax = require('postcss-scss');
const webpackConfig = require('./webpack.config');

const $ = require('gulp-load-plugins')({ lazy: false });

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

gulp.task('clean', () => del(destPath));

gulp.task('build', () => {
  runSequence('build:image', ['build:scss', 'webpack:build']);
});


gulp.task('build:scss', () => {
  return gulp.src([`${assetsPaths.app}/stylesheets/roots/*.scss`])
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

gulp.task('server', () => {
  browserSync({
    files: [
      './app/views/**/*.html.*',
      `${destPath}/*.js`,
      `${destPath}/*.css`
    ],
    proxy: {
      target: 'localhost:3000',
      middleware(req, res, next) {
        next();
      }
    },
    ui: false,
    notify: false,
    ghostMode: false//,
    // startPath: '/index.html',
    // server: {
    //   baseDir: 'dest',
    //   directory: true
    // }
  });
});

const devWebpack = webpack(Object.assign({}, webpackConfig, {
  devtool: 'hidden-source-map',
  debug: true
}));
gulp.task('webpack:dev', cb => {
  devWebpack.run((err, stats) => {
    if (err) { throw new gutil.PluginError('webpack:dev', err); }
    gutil.log('[webpack:dev]', stats.toString({ colors: true }));
    cb();
  });
});

gulp.task('webpack:build', cb => {
  const finalWebpackConfig = Object.assign({}, webpackConfig, {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        // output: {
        //   comments: require('uglify-save-license')
        // },
        compress: { warnings: false }
      })
    ]
  });

  webpack(finalWebpackConfig, (err, stats) => {
    if (err) { throw new gutil.PluginError('webpack:build', err); }
    gutil.log('[webpack:build]', stats.toString({ colors: true }));
    cb();
  });
});

gulp.task('default', cb => {
  runSequence(
    'clean',
    'build:image',
    ['webpack:dev', 'build:scss'],
    cb
  );
});

gulp.task('watch', ['default', 'server'], () => {
  gulp.watch([`${assetsPaths.app}/javascripts/**/*.{js,jsx,ts,tsx}`], ['webpack:dev'])
    .on('change', ev => {
      console.log(`File ${ev.path} was ${ev.type}, running build task...`);
    });
  // gulp.watch(['dest/assets/js/*.js']).on('change', browserSync.reload);
});


// gulp.task('watch', ['default'], () => {
//   gulp.watch([assetsPaths.app + '/javascripts/**/*.coffee'], ['build:js'])
//     .on('change', (e) => {
//       console.log(`File ${e.path} was ${e.type}, running build task...`);
//     });
//   gulp.watch([assetsPaths.app + '/stylesheets/**/*.(css|scss|sass)'], ['build:css'])
//     .on('change', (e) => {
//       console.log(`File ${e.path} was ${e.type}, running build task...`);
//     });
// });
