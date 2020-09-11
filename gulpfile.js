const {src, dest, watch, parallel, series} = require('gulp'); 
const concat = require('gulp-concat'); 
const terser = require('gulp-terser'); 
const sass = require('gulp-sass'); 
const sourcemaps = require('gulp-sourcemaps'); 
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cleancss = require('gulp-clean-css'); 
const browsersync = require('browser-sync'); 
const files = {
    jsConfig: 'app/js/config/**/**/*js',
    jsControllers: 'app/js/controllers/**/*js',
    scss: 'app/scss/style.scss',
    scssAll: 'app/scss/**/*scss'
}

const scss = () => {
    return src(files.scss)
        .pipe(sourcemaps.init())
        .pipe(sass()) 
        .pipe(postcss([autoprefixer()])) 
        .pipe(cleancss()) 
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist'))
        .pipe(browsersync.stream());
}

const jsConfig = () => {
    return src(files.jsConfig)
        .pipe(sourcemaps.init())
        .pipe(concat('config.js')) 
        .pipe(terser()) 
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist'));
}

const jsControllers = () => {
    return src(files.jsControllers)
        .pipe(sourcemaps.init())
        .pipe(concat('controllers.js')) 
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist'));
}

const init = () => {
    browsersync.init({
        proxy: {
            target: 'http://localhost/project-setup'
        }
    });
}

const watchFiles = () => {
    init();
    watch(['*php', 'app/config/**/**/*php', 'app/controllers/**/**/*php']).on('change', browsersync.reload);
    watch(files.jsConfig, jsConfig).on('change', browsersync.reload);
    watch(files.jsControllers, jsControllers).on('change', browsersync.reload);
    watch(files.scssAll, scss);
}

exports.default = series(
    parallel(jsConfig, jsControllers, scss),
    watchFiles
);