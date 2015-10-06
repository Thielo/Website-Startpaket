// gulp.js einbauen
var gulp = require('gulp'),
    changed = require('gulp-changed'),
    jshint = require ('gulp-jshint'),
    concat = require ('gulp-concat'),
    uglify = require ('gulp-uglify'),
    rename = require('gulp-rename'),
    imagemin = require ('gulp-imagemin'),
    clean = require('gulp-clean'),
    flatten = require('gulp-flatten'),
    minifyhtml = require ('gulp-minify-html'),
    autoprefixer = require ('gulp-autoprefixer'),
    minifyCSS = require ('gulp-minify-css'),
    sass =  require ('gulp-sass'),
    less =  require ('gulp-less'),
    msg = require('gulp-msg')
    browserSync = require('browser-sync').create();

// Define all Filepaths
var paths = {
    devUrl: 'whatever.app',
	assets: {
        allstyle: './assets/scss/**/*',
        folder: './assets/',
		scss: './assets/scss/*.scss',
		img: './assets/images/**/*'
	},
	dist: {
        folder: './dist/',
		css: './dist/css',
		img: './dist/images'
	}
};

// Do all images
gulp.task('images', function() {
  	gulp.src(paths.assets.img)
    	.pipe(changed(paths.dist.img))
    	.pipe(imagemin())
		.pipe(gulp.dest(paths.dist.img));
});

// Do my SASS
gulp.task('scss',function(){
	gulp.src(paths.assets.css)
		.pipe(changed(paths.assets.css))
    	.pipe(sass({outputStyle: 'compressed'}))
    	.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    	.pipe(minifyCSS())
    	.pipe(gulp.dest(paths.dist.css));
});

gulp.task('less',function(){
    gulp.src(paths.assets.css)
        .pipe(changed(paths.assets.css))
        .pipe(less({compress: true}))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest(paths.dist.css));
});

// Do the fonts-dance
gulp.task('fonts', function() {
//.{ttf,woff,eof,svg}
    return gulp.src(paths.assets.folder + 'fonts/**/*')
    .pipe(flatten())
    .pipe(gulp.dest(paths.dist.folder + 'fonts'));
});

// Watch my ass!
gulp.task('watch', function() {

    browserSync.init({
        files: ['*.php'],
        proxy: paths.devUrl
    });

    gulp.watch(paths.assets.images, ['images']);
    gulp.watch([paths.assets.folder + 'fonts'], ['fonts']);
    gulp.watch([paths.assets.folder + 'scss/**/*'], ['scss']).on("change", browserSync.reload);
    //gulp.watch([paths.assets.folder + 'less/**/*'], ['less']).on("change", browserSync.reload);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'scss', 'images','fonts']);
