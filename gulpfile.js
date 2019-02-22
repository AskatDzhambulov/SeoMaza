const { series, src, dest, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const del = require('del'); 
const googleWebFonts = require('gulp-google-webfonts');


const clean = () => del(['dist']);

const css = () => {
  return src('./sass/**/*.scss')
  .pipe(sass({includePaths: require('node-normalize-scss').includePaths}).on('error', sass.logError))
  .pipe(dest('./dist/css'));  
}

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

const images = () => src('./images/**/*').pipe(dest('./dist/images'));

const build = series(clean, parallel(html, images, fontawesome, fonts, css, js));

const dev = () => {
  watch('./templates/**/*.html', html);
  watch('./images/**/*', images)
  watch('./sass/**/*.scss', css);
}

const runDev = series(build, dev)

exports.css = css;
exports.clean = clean;
exports.runDev = runDev;
exports.build = build;
exports.default = build;