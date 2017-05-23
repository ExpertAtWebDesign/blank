'use strict';

// Gulp Constants
const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');

const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const prefix = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const gutil = require('gulp-util');

const imagemin = require('gulp-imagemin');

const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const tsify = require("tsify");

const browserSync = require('browser-sync');
const reload = browserSync.reload;


// Paths
var pugFiles = 'app/*.pug',
    pugDest = 'dist';

var cssFiles = 'app/style/**/*.scss',
    cssDest = 'dist/css';

var jsFiles = 'app/scripts/**/*.ts',
    jsDest = 'dist/js';

var imgFiles = 'app/img/**';


// Utilities
var watchedBrowserify = browserify({
  basedir: '.',
  debug: true,
  entries: ['app/scripts/app.ts'],
  cache: {},
  packageCache: {}
}).plugin(tsify);


// Functions
function bundle() {
  return watchedBrowserify
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(jsDest))
    .pipe(reload({ stream: true }));
}


// Pug Task
gulp.task('pug', function(){
  return gulp.src( pugFiles )
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest( pugDest ))
    .pipe(reload({ stream: true }));
});


// CSS Task
gulp.task('css', function(){
  return gulp.src( cssFiles )
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(prefix({
      browsers: ['last 2 versions']
    }))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest( cssDest ))
    .pipe(reload({ stream: true }));

});


// JS Task
// gulp.task('scripts', function() {
//   return gulp.src( jsFiles )
//     .pipe( sourcemaps.init() )
//     .pipe( concat('scripts.js') )
//     .pipe( rename('scripts.min.js') )
//     .pipe( uglify() )
//     .pipe( sourcemaps.write() )
//     .pipe( gulp.dest( jsDest ) )
//     .pipe( reload({ stream: true }) );
// });


// Typescript Task
gulp.task('ts', bundle);


// Images Task
gulp.task('images', function(){
  return gulp.src( imgFiles )
    .pipe( imagemin() )
    .pipe( gulp.dest('dist/img') );
});


// Gulp Server
gulp.task('serve', [ 'pug', 'css', 'ts', 'images' ], function(){
  browserSync({
    server: {
      baseDir: 'dist'
    }
  });

  // Watch Files
  gulp.watch( pugFiles, ['pug']);
  gulp.watch( cssFiles, ['css']);
  // gulp.watch( jsFiles, ['scripts'] );
  gulp.watch( jsFiles, ['ts'] );
  gulp.watch( imgFiles, ['images'] );
});


// Default Task
gulp.task('default', [ 'pug', 'css', 'ts', 'images' ]);
