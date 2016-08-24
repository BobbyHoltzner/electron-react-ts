var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var ts = require('gulp-typescript');
var notify = require("gulp-notify");
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babelify = require('babelify');
var tsify = require("tsify");
// Set up the typescript project
let tsProject = ts.createProject('tsconfig.json', {typescript: require('ntypescript')});

// src files for the project
let srcFiles = [
  '**/*.tsx',
  '**/*.ts',
  '!node_modules/**',
  '!test/**',
  '!build/**',
  '!typings/**'
];

// Default gulp task
gulp.task('default', ['build']);
// Create the watch task
gulp.task('watch', ['build'], createGulpWatch(srcFiles, ['build']));

gulp.task('build',  ['tsbuild', 'bundle']);

gulp.task('tsbuild', function(){
  // Set the options for the notification
  let options = {
    onLast: true,
    message: 'TS Build Finished!'
  };
  let tsResult = gulp.src(srcFiles)
    .pipe(sourcemaps.init()) // Generate source maps
    .pipe(ts(tsProject)).js
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'))
    .pipe(notify(options));
  return tsResult;
});

function createGulpWatch(sources, tasks){
  return function() {
    var watcher = gulp.watch(sources, tasks);
    watcher.on('change', function(event){
      gutil.log('File ' + event.path + ' was ' + event.type);
    });
  };
}
//
gulp.task('bundle', function(){
  let bundler = createTsBrowserify();
  return bundleHtml(bundler);
});

function createTsBrowserify(){
  return browserify({
    entries: ['./src/index.tsx'],
    extensions: ['.ts', '.tsx'],
    debug: true,
    fullPaths : true,
    cache : {}, // <---- here is important things for optimization
    packageCache : {} // <----  and here
  })
  .plugin(tsify, { typescript: require('ntypescript')})
  .transform(babelify, {extensions: ['.ts', '.tsx']});
}

function bundleHtml(bundler){
  let options = {
    onLast: true,
    message: 'Bundle Finished!'
  };
  return bundler.bundle()
  .on('error', function (error) { gutil.log(error.toString()); })
  .pipe(source('build/bundle.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({ loadMaps: true }))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('build/', {base: './'}))
  .pipe(notify(options));
}
