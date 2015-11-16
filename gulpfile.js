'use strict';

var gulp        = require('gulp'),
	browserSync = require('browser-sync').create(),
	SSI 		= require('browsersync-ssi'),
	concat      = require('gulp-concat'),
	minifyCss   = require('gulp-minify-css'),
	minify   	= require('gulp-minify'),
	plumber     = require('gulp-plumber'),
	rename      = require('gulp-rename'),
	sass        = require('gulp-sass'),
	zip			= require('gulp-zip');

// Static Server + watching scss/html files
gulp.task('serve', function() {

	browserSync.init({
		server: {
			baseDir:["./dist"],
			middleware:SSI({
				baseDir:'./dist',
				ext:'.shtml',
				version:'2.10.0'
			})
		}
	});

	gulp.watch("app/scss/**/*.scss", ['sass']);
	gulp.watch("app/scripts/**/*.js", ['js']);
	gulp.watch("dist/**/*.html").on("change",browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
	
	return gulp.src("app/scss/**/*.scss")
		.pipe(plumber())
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(sass({outputStyle:"compact"}))
		.pipe(gulp.dest("dist/styles"))
		.pipe(browserSync.stream());
});

// javscript files operate
gulp.task('js', function(){
	return gulp.src('app/scripts/**/*.js')
		.pipe(plumber())
		.pipe(minify())
		.pipe(gulp.dest("dist/scripts"))
		.pipe(browserSync.stream());
});

// publish
gulp.task('dist-sass', function(){
	return gulp.src("app/src/scss/main.scss")
		//.pipe(plumber())
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