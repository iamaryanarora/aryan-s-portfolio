// node.js Packages / Dependencies
const gulp          = require('gulp');
const gulpSass      = require('gulp-sass');
const sass          = gulpSass(require('sass'));
const uglify        = require('gulp-uglify');
const rename        = require('gulp-rename');
const concat        = require('gulp-concat');
const cleanCSS      = require('gulp-clean-css');
const imageMin      = require('gulp-imagemin');
const pngQuint      = require('imagemin-pngquant'); 
const browserSync   = require('browser-sync').create();
const autoprefixer  = require('gulp-autoprefixer');
const jpgRecompress = require('imagemin-jpeg-recompress'); 
const clean         = require('gulp-clean');


// Paths
const paths = {
    root: { 
        www: './public_html'
    },
    src: {
        scss: 'public_html/assets/scss/**/*.scss',
        css: 'public_html/assets/css/*.css',
        js: 'public_html/assets/js/*.js',
        vendors: 'public_html/assets/vendors/**/*.*'
    },
    dist: {
        css: 'public_html/dist/css',
        js: 'public_html/dist/js',
        vendors: 'public_html/dist/vendors'
    }
};

// Compile SCSS
gulp.task('sass', () => {
    return gulp.src(paths.src.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('public_html/assets/css'))
        .pipe(browserSync.stream());
});

// Minify + Combine CSS
gulp.task('css', () => {
    return gulp.src(paths.src.css)
        .pipe(cleanCSS())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest(paths.dist.css));
});

// Minify + Combine JS
gulp.task('js', () => {
    return gulp.src(paths.src.js)
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.dist.js))
        .pipe(browserSync.stream());
});

// Compress (JPEG, PNG, GIF, SVG, JPG)
gulp.task('img', function(){
    return gulp.src(paths.src.imgs)
    .pipe(imageMin([
        imageMin.gifsicle(),
        imageMin.jpegtran(),
        imageMin.optipng(),
        imageMin.svgo(),
        pngQuint(),
        jpgRecompress()
    ]))
    .pipe(gulp.dest(paths.dist.imgs));
});

// Copy vendors
gulp.task('vendors', () => {
    return gulp.src(paths.src.vendors)
        .pipe(gulp.dest(paths.dist.vendors));
});

// clean dist
gulp.task('clean', function () {
    return gulp.src(paths.dist.root)
        .pipe(clean());
});

// Build task
gulp.task('build', gulp.series('sass', 'css', 'js', 'vendors'));


// Watch files
gulp.task('watch', () => {
    browserSync.init({
        server: {
            baseDir: paths.root.www
        }
    });
    
    gulp.watch(paths.src.scss, gulp.series('sass'));
    gulp.watch(paths.src.js, gulp.series('js'));
    gulp.watch(paths.root.www + '/**/*.html').on('change', browserSync.reload);
});

// Default task
gulp.task('default', gulp.series('build', 'watch'));