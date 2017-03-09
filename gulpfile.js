'use strict';

var gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
	SSI = require('browsersync-ssi'),
	minifyCss = require('gulp-clean-css'),
	minify = require('gulp-minify'),
	plumber = require('gulp-plumber'),
	sass = require('gulp-sass'),
	Tmaker = require('gulp-tmaker'),
	rm = require('gulp-rm'),
	yargs = require('yargs'),
	wjson = require('write-json'),
	verAppend = require('gulp-version-number'),
	fs = require('fs'),
	useref = require('gulp-useref'),
	gulpif = require('gulp-if'),
	path = require('path'),
	projectInfo = require('./projectInfo.json'),
	gulpSSI = require('gulp-html-ssi');

var switchProjectName = '_init';

var fedisPath = {
	htmlSrc: './app/' + projectInfo.projectName + '/**/*.html',
	htmlDist: './dist/' + projectInfo.projectName + '/',
	sassSrc: './app/' + projectInfo.projectName + '/scss/**/*.scss',
	sassDist: './dist/' + projectInfo.projectName + '/styles/',
	jsSrc: './app/' + projectInfo.projectName + '/scripts/**/*.js',
	jsDist: './dist/' + projectInfo.projectName + '/scripts/',
	dataSrc: './app/' + projectInfo.projectName + '/data/*.*',
	dataDist: './dist/' + projectInfo.projectName + '/data/',
	assetSrc: './app/' + projectInfo.projectName + '/scss/*.+(jpg|png|gif)',
	assetDist: './dist/' + projectInfo.projectName + '/styles/'
}

// Static Server + watching scss/html files
gulp.task('serve', ['Tmaker', 'sass', 'js'], function () {

	browserSync.init({
		server: {
			baseDir: ["./dist/" + projectInfo.projectName],
			middleware: SSI({
				baseDir: './dist/' + projectInfo.projectName,
				ext: '.html',
				version: '2.10.0'
			})
		}
	});

	gulp.watch(fedisPath.sassSrc, ['sass']);
	gulp.watch(fedisPath.assetSrc, ['asset']);
	gulp.watch(fedisPath.dataSrc, ['preview-data']);
	gulp.watch(fedisPath.jsSrc, ['js']);
	gulp.watch(fedisPath.htmlSrc, ['Tmaker']);
	console.log('当前项目 :' + projectInfo.projectName);
});

gulp.task('Tmaker', function () {
	return gulp.src(fedisPath.htmlSrc)
		.pipe(plumber())
		.pipe(Tmaker({ isPreview: true }))
		.pipe(gulp.dest(fedisPath.htmlDist))
		.pipe(browserSync.stream());
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
	return gulp.src(fedisPath.sassSrc)
		.pipe(plumber())
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(sass({ outputStyle: "compact" }))
		.pipe(gulp.dest(fedisPath.sassDist))
		.pipe(browserSync.stream());
});

// javscript files operate
gulp.task('js', function () {
	return gulp.src(fedisPath.jsSrc)
		.pipe(plumber())
		.pipe(gulp.dest(fedisPath.jsDist))
		.pipe(browserSync.stream());
});

gulp.task('preview-data', function () {
	return gulp.src(fedisPath.dataSrc)
		.pipe(gulp.dest(fedisPath.dataDist));
});

gulp.task('asset', function () {
	return gulp.src(fedisPath.assetSrc)
		.pipe(gulp.dest(fedisPath.assetDist));
});

// publish
function semverUpdate(key) {

	var versionJson,
		semver = {
			major: 0,
			minor: 1,
			patch: 2
		},
		semverArr;

	if (fs.existsSync('./app/' + projectInfo.projectName + '/version.json')) {
		versionJson = require('./app/' + projectInfo.projectName + '/version.json');
	} else {
		versionJson = { "version": "1.0.0" }
	}

	semverArr = versionJson.version.split('.');
	semverArr[semver[key]] = (parseInt(semverArr[semver[key]]) + 1).toString();

	semverArr[1] = semver[key] < 1 ? 0 : semverArr[1];
	semverArr[2] = semver[key] < 2 ? 0 : semverArr[2];

	versionJson.version = semverArr.join('.');
	wjson.sync('./app/' + projectInfo.projectName + '/version.json', versionJson);
	return versionJson.version;
}

gulp.task('publish', function () {
	if (projectInfo.projectName == 'null') {
		console.log('\n 请先执行 "gulp --switch projectName" 新建一个项目\n');
		return null;
	}
	var key = (yargs.argv.major && 'major') || (yargs.argv.minor && 'minor') || (yargs.argv.patch && 'patch') || (yargs.argv.nover && 'nover') || 'patch';
	var gulpStream = null,
		canAppendVer = true;

	if (key == 'nover') {
		canAppendVer = false;
		key = 'patch';
	}

	var version = semverUpdate(key);

	gulp.src(fedisPath.assetSrc)
		.pipe(gulp.dest('release/' + projectInfo.projectName + '-' + version));

	gulpStream = gulp.src(fedisPath.htmlSrc)
		.pipe(plumber())
		.pipe(gulpSSI())
		.pipe(Tmaker({ isPreview: false }))
		.pipe(useref({ searchPath: fedisPath.htmlDist }))
		.pipe(gulpif('*.js', minify()))
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(gulp.dest('release/' + projectInfo.projectName + '-' + version))
		.on('end', function () {
			console.log('已发布项目 ' + projectInfo.projectName + '-' + version)
		});
});

// switch project
gulp.task('switch', function (cb) {

	// 切换/新建 项目
	if (yargs.argv.switch == 'null') {
		console.log('\n 项目名不能为 null');
		return;
	}

	if (yargs.argv.switch) {
		switchProjectName = yargs.argv.switch;

		// 如果要切换的项目是 _init 或 已经在要切换的项目，直接返回。
		if (switchProjectName == projectInfo.projectName || projectInfo.projectName == '_init') {
			return;
		}

		if (fs.existsSync('app/' + switchProjectName)) {
			// 切换项目
			projectInfo.projectName = switchProjectName;
			wjson.sync('projectInfo.json', projectInfo);
			console.log('已切换到项目 ' + switchProjectName);
		}
		else {
			// 新建项目
			console.log('新建 ' + switchProjectName + ' 项目');
			gulp.src('app/_init/**/*', { dot: true })
				.pipe(gulp.dest('app/' + switchProjectName))
				.on('end', function () {
					projectInfo.projectName = switchProjectName;
					wjson.sync('projectInfo.json', projectInfo);
					process.stdout.write(`新建项目完成\n`);
				});
		}
		return;
	}

	if (projectInfo.projectName == 'null') {
		console.log('\n 请先执行 "gulp --switch projectName" 新建一个项目');
		return;
	}

	// 显示当前项目列表
	if (yargs.argv.show) {
		console.log('\n 当前项目 :\n');
		fs.readdirSync('app/').forEach(function (item) {
			if (item == '_init') { return; }
			console.log('   ' + item);
		})
		return console.log('\n 已列出所有项目\n');
	}

	gulp.start('serve');
});

gulp.task('default', ['switch']);