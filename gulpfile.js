'use strict';

var gulp        = require('gulp'),
	browserSync = require('browser-sync').create(),
	SSI 		= require('browsersync-ssi'),
	concat      = require('gulp-concat'),
	minifyCss   = require('gulp-minify-css'),
	plumber     = require('gulp-plumber'),
	rename      = require('gulp-rename'),
	sass        = require('gulp-sass'),
	zip			= require('gulp-zip');

// Static Server + watching scss/html files
gulp.task('serve',['sass'], function() {

	browserSync.init({
		server: {
			baseDir:["./app/docs"],
			middleware:SSI({
				baseDir:'./app/docs',
				ext:'.shtml',
				version:'2.9.11'
			})
		}
	});

	gulp.watch("app/src/scss/*.scss", ['sass']);
	gulp.watch("app/src/js/**/*.js", ['js']);
	gulp.watch("app/docs/include/**/*.html").on("change",browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
	return gulp.src("app/src/scss/*.scss")
		.pipe(plumber())
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(sass({outputStyle:"compact"}))
		.pipe(gulp.dest("app/docs/styles"))
		.pipe(browserSync.stream());
});

// javscript files operate
gulp.task('js', function(){
	return gulp.src('app/src/js/**/*.js')
		.pipe(plumber())
		.pipe(gulp.dest("app/docs/scripts"))
		.pipe(browserSync.stream());
});

// publish
gulp.task('dist-sass', function(){
	return gulp.src("app/src/scss/main.scss")
		.pipe(plumber())
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(sass({outputStyle:"compact"}))
		.pipe(gulp.dest("app/docs/dist/style"))
		.pipe(minifyCss())
		.pipe(rename('main.min.css'))
		.pipe(gulp.dest("app/docs/dist/style"));
});


gulp.task('dist-font', function(){
	return gulp.src('app/docs/fonts/*.*')
		.pipe(plumber())
		.pipe(gulp.dest('app/docs/dist/fonts/'))
});


gulp.task('dist-js', function(){
	return gulp.src('app/src/js/kernel/*.js')
		.pipe(plumber())
		.pipe(gulp.dest("app/docs/dist/script"))
});


gulp.task('publish', ['dist-sass', 'dist-js', 'dist-font'], function(){});

gulp.task('default', ['serve']);