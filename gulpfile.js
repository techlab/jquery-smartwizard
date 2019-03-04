var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    babel = require("gulp-babel"),
    postcss = require('gulp-postcss'),
    cleanCSS = require('gulp-clean-css'),
    cssbeautify = require('gulp-cssbeautify'),
    autoprefixer = require('autoprefixer'),
    karma = require('karma'),
    del = require('del');

// Source files
var SRC_JS = 'src/js/*.js';
var SRC_CSS = 'src/css/*.css';

// Destination folders
var DEST_JS = 'dist/js';
var DEST_CSS = 'dist/css';

// JS TASKS
// Lint JS
gulp.task('lint:js', function() {
    return gulp.src(SRC_JS)
            .pipe(jshint())
            .pipe(jshint.reporter('default'))
            .pipe(jshint.reporter('fail'));
});

gulp.task('clean:js', function () {
    return del([DEST_JS]);
});

gulp.task('clean:css', function () {
    return del([DEST_CSS]);
});

// CLEAN files
gulp.task('clean', gulp.series(gulp.parallel('clean:js', 'clean:css')));

// Build JS
gulp.task('build:js', gulp.series(gulp.parallel('clean:js', 'lint:js'), function() {
    return gulp.src(SRC_JS)
        .pipe(babel())
        .pipe(gulp.dest(DEST_JS))
        .pipe(uglify({preserveComments:'license'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(DEST_JS));
}));

// CSS TASKS
gulp.task('build:css', gulp.series(gulp.parallel('clean:css'), function () {
    return gulp.src(SRC_CSS)
        .pipe(postcss( [autoprefixer({browsers: ['last 10 versions']})] ))
        .pipe(cssbeautify({ autosemicolon: true }))
        .pipe(gulp.dest(DEST_CSS))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(DEST_CSS));
}));

// WATCH for file changes and rerun the task
gulp.task('watch', function() {
    gulp.watch(SRC_JS, gulp.parallel('build:js'));
    gulp.watch(SRC_CSS, gulp.parallel('build:css'));
});

// TEST
gulp.task('test', function (done) {
    new karma.Server({
      configFile: __dirname + '/karma.conf.js',
      singleRun: true
    }, function() {
        done();
    }).start();
});

// DEFAULT task
gulp.task('default', gulp.series(gulp.parallel('build:js', 'build:css'), function(done) {
    done();
}));