const { series, src, dest, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
const normalize = require('node-normalize-scss');
const browsersync = require("browser-sync").create();
sass.compiler = require('node-sass');
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const cssnano = require('gulp-cssnano');
const googleWebFonts = require('gulp-google-webfonts');
const del = require('del');
// var plumber = require('gulp-plumber');



const browserSync = (done) => {
  browsersync.init({
    server: {
      baseDir: "./dist/"
    },
    port: 3000,
  });
  done();
}

const browserSyncReload = (done) => {
  browsersync.reload();
  done();
}

const clean = () => del(['dist']);


const css = () => {
  return src(['./sass/**/*.scss'])
  .pipe(sass({includePaths: normalize.includePaths}).on('error', sass.logError))
  .pipe(rename({ suffix: ".min"}))
  .pipe(autoprefixer())
  .pipe(cssnano({discardComments: {removeAll: true}}))
  .pipe(dest('./dist/css'))
}


// const minifyGoogleFonts = () => {
//   return src('.dist/css/googleFonts.css')
//   .pipe(rename({ suffix: ".min"}))
//   .pipe(autoprefixer())
//   .pipe(cssnano())
//   .pipe(del(['dist/css']))
// }


const html = () => {
  return src('./templates/**/*.html')
  .pipe(dest('./dist/'))
}

const  js = () => {
  return src('./js/**/*.js')
  .pipe(dest('./dist/js'))
}

const fontawesome = () =>{
  return src('node-modules/@fortawasome/fontawesome-free/webfonts/*')
  .pipe(dest('./dist/webfonts'));
}

const fonts = () => {
  return src('./fonts.list')
  .pipe(googleWebFonts({
    fontsDir: 'fonts/',
    cssDir: 'css/',
    cssFilename: 'googleFonts.css',
    relativePaths: true
  }))
  .pipe(dest('./dist/')); 
}

// const plumber =() => {
//   return src('./src/*.ext')
//   .pipe(plumber())
//   .pipe(dest('./dist'));
// }

const images = () => src('./images/**/*').pipe(dest('./dist/images'));

const build = series(clean, parallel(html, images, fontawesome, fonts, css, js));

const dev = () => {
  watch('./templates/**/*.html', html),
  watch('./images/**/*', images),
  watch('./sass/**/*.scss', css),
  watch('./dist', browserSyncReload);

}

const runDev = series(build, parallel(dev,browserSync));

exports.css = css;
exports.clean = clean;
exports.runDev = runDev;
exports.build = build;
exports.default = build;