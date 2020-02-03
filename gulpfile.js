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
    del           = require('del');

var Server        = require('karma').Server;

// Source files
var SRC_JS        = 'src/js/*.js';
var SRC_CSS       = 'src/css/*.css';

// Destination folders
var DEST_JS       = 'dist/js';
var DEST_CSS      = 'dist/css';


// BUILD
const build_js = gulp.series(clean_js, lint_js, function(cb) {
                      gulp.src(SRC_JS)
                            .pipe(babel())
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

const build = gulp.parallel(build_js, build_css);
build.description = 'Build the files';

// LINT
const lint = gulp.parallel(lint_js);
lint.description = 'Link js files';

function lint_js(cb) {
  gulp.src(SRC_JS)
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(jshint.reporter('fail'));

  cb();
}


// CLEAN
const clean = gulp.parallel(clean_js, clean_css);
clean.description = 'Clean the files'

function clean_js(cb) {
  del([DEST_JS]);

  cb();
}

function clean_css(cb) {
  del([DEST_CSS]);

  cb();
}


// WATCH
const watch = gulp.parallel(watch_all);
watch.description = 'Watch for changes to all source';

function watch_all(cb) {
  gulp.watch(SRC_JS, build_js);
  gulp.watch(SRC_CSS, build_css);

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
