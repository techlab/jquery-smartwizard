var gulp          = require('gulp'),
    jshint        = require('gulp-jshint'),
    rename        = require('gulp-rename'),
    uglify        = require('gulp-uglify'),
    saveLicense   = require('uglify-save-license'),
    babel         = require("gulp-babel"),
    postcss       = require('gulp-postcss'),
    cleanCSS      = require('gulp-clean-css'),
    cssbeautify   = require('gulp-cssbeautify'),
    autoprefixer  = require('autoprefixer'),
    sass          = require('gulp-sass'),
    del           = require('del');

sass.compiler     = require('node-sass');
var Server        = require('karma').Server;

// Source files
var SRC_JS        = 'src/js/*.js';
var SRC_CSS       = 'src/css/*.css';
var SRC_SCSS      = 'src/scss/*.scss';

// Destination folders
var DEST_JS       = 'dist/js';
var DEST_CSS      = 'dist/css';
var DEST_SCSS     = 'src/css';


// BUILD JS
const build_js = gulp.series(clean_js, lint_js, function(cb) {
                      gulp.src(SRC_JS)
                            .pipe(babel({
                                presets: ['@babel/env']
                            }))
                            .pipe(gulp.dest(DEST_JS))
                            .pipe(uglify({
                                output: {
                                    comments: saveLicense
                                }
                            }))
                            .pipe(rename({
                                suffix: '.min'
                            }))
                            .pipe(gulp.dest(DEST_JS));

                      cb();
                    });

// BUILD CSS
const build_css = gulp.series(clean_css, function(cb) {
                      gulp.src(SRC_CSS)
                            .pipe(postcss( [autoprefixer()] ))
                            .pipe(cssbeautify({ autosemicolon: true }))
                            .pipe(gulp.dest(DEST_CSS))
                            .pipe(cleanCSS({compatibility: 'ie8'}))
                            .pipe(rename({suffix: '.min'}))
                            .pipe(gulp.dest(DEST_CSS));

                      cb();
                    });

// BUILD SCSS
const build_scss = gulp.series(function(cb) {
                      gulp.src(SRC_SCSS)
                            .pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
                            .pipe(gulp.dest(DEST_SCSS));

                      cb();
                    }, build_css);

// BUILD ALL
const build = gulp.parallel(build_js, build_scss);
build.description = 'Build the files';


// LINT
const lint = gulp.parallel(lint_js);
lint.description = 'Link js files';

function lint_js(cb) {
  gulp.src(SRC_JS)
      .pipe(jshint({ "esversion": 8 }))
      .pipe(jshint.reporter('default'));

  cb();
}


// CLEAN
const clean = gulp.parallel(clean_js, clean_css);
clean.description = 'Clean the files'

function clean_js(cb) {
  del.sync([DEST_JS]);

  cb();
}

function clean_css(cb) {
  del.sync([DEST_CSS]);

  cb();
}


// WATCH
const watch = gulp.parallel(watch_all);
watch.description = 'Watch for changes to all source';

function watch_all(cb) {
  gulp.watch(SRC_JS, build_js);
  gulp.watch(SRC_CSS, build_css);
  gulp.watch(SRC_SCSS, build_scss);

  cb();
}



// TEST
function test(cb) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();

  cb();
}


// EXPORT methods
exports.clean   = clean;
exports.build   = build;
exports.lint    = lint;
exports.watch   = watch;
exports.test    = test;
exports.default = exports.build;
