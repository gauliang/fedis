'use strict';

var gulp        = require('gulp'),
	browserSync = require('browser-sync').create(),
	SSI 		= require('browsersync-ssi'),
	minifyCss   = require('gulp-clean-css'),
	minify   	= require('gulp-minify'),
	plumber     = require('gulp-plumber'),
	sass        = require('gulp-sass'),
	Tmaker      = require('gulp-tmaker'),
	rm      	= require('gulp-rm'),
	yargs      	= require('yargs'),
	wjson		= require('write-json'),
	verAppend 	= require('gulp-version-number'),
	fs			= require('fs'),
	useref		= require('gulp-useref'),
	gulpif 		= require('gulp-if'),
	projectInfo	= require('./projectInfo.json');
	
var switchProjectName = '_init',
	archiveName = '_init';

// Static Server + watching scss/html files
gulp.task('serve', ['Tmaker', 'sass', 'js'], function() {

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
	gulp.watch("app/scss/*.+(jpg|png|gif)", ['asset']);
	gulp.watch("app/data/*.*", ['preview-data']);
	gulp.watch("app/scripts/**/*.js", ['js']);
	gulp.watch("app/**/*.html", ['Tmaker']);
	console.log('当前项目 :' + projectInfo.projectName);
});

gulp.task('Tmaker',function () {
	return gulp.src("app/**/*.html")
		.pipe(plumber())
		.pipe(Tmaker({isPreview:true}))
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.stream());
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
		.pipe(gulp.dest("dist/scripts"))
		.pipe(browserSync.stream());
});

gulp.task('preview-data', function () {
	return gulp.src('./app/data/*.*')
		.pipe(gulp.dest('dist/data'));
});

gulp.task('asset', function () {
	return gulp.src('./app/scss/*.+(jpg|png|gif)')
		.pipe(gulp.dest('dist/styles'));
});

// publish
function semverUpdate(key){
	
	var versionJson,
		semver = {		
			major:0,
			minor:1,
			patch:2
		},
		semverArr;
		
	if(fs.existsSync('./app/version.json')){
		versionJson  = require('./app/version.json');		
	} else {
		versionJson = { "version":	"1.0.0"}
	}
		
	semverArr = versionJson.version.split('.');	
	semverArr[semver[key]] = (parseInt(semverArr[semver[key]]) + 1).toString();
	
	semverArr[1] = semver[key] < 1 ? 0 : semverArr[1];
	semverArr[2] = semver[key] < 2 ? 0 : semverArr[2];
	
	versionJson.version = semverArr.join('.');
	wjson.sync('./app/version.json',versionJson);
	return versionJson.version;
}

gulp.task('asset-publish',function () {
	return gulp.src('./app/scss/*.+(jpg|png)')
		.pipe(gulp.dest('dist/'));
});

gulp.task('publish', ['asset-publish'], function(){
	if(projectInfo.projectName == 'null'){
		console.log('\n 请先执行 "gulp --switch projectName" 新建一个项目\n');
		return null;
	}
	var key = (yargs.argv.major && 'major') || (yargs.argv.minor && 'minor') || (yargs.argv.patch && 'patch') || 'patch';
	var version = semverUpdate(key);
	gulp.src('app/**/*.html')
		.pipe(plumber())
		.pipe(Tmaker({isPreview:false}))
		.pipe(useref({ searchPath: './dist' }))
		.pipe(gulpif('*.js', minify()))
        .pipe(gulpif('*.css', minifyCss()))
		.pipe(verAppend({'append':{key:'v',to:[['css','%MD5%'],['js','%MD5%']]}}))
		.pipe(gulp.dest('release/'+projectInfo.projectName + '-' + version))
		.on('end',function(){console.log('已发布项目 ' + projectInfo.projectName + '-' + version)});
});

// switch project
gulp.task('switch', function(cb){
	
	// 切换/新建 项目
	if(yargs.argv.switch == 'null'){
		console.log('\n 项目名不能为 null');
		return ;
	}
	
	if(yargs.argv.switch){
		switchProjectName = yargs.argv.switch;
		if(switchProjectName == projectInfo.projectName){			
			return ;
		}		
		// 存档
		if(projectInfo.projectName != '_init'){
			
			console.log('存档 '+ projectInfo.projectName+ ' 项目');
			
			if(fs.existsSync('archive/'+ projectInfo.projectName))
			{
				gulp.src('archive/' + projectInfo.projectName).pipe(rm({async:false}));
			}
			
			gulp.src('app/**/*',{ dot: true })
				.pipe(plumber())
				.pipe(gulp.dest('archive/'+ projectInfo.projectName))
				.on('end',function(){
					// 清理 app & dist
					console.log('清理 app & dist 目录');
					gulp.src('app/**/*').pipe(rm({async:false}));
					gulp.src('dist/**/*').pipe(rm({async:false}))
					
					// 切换项目
					if(fs.existsSync('archive/'+ switchProjectName))
					{
						console.log('读取 '+switchProjectName+' 项目数据');
						archiveName = switchProjectName;
					}
					else
					{						
						console.log('新建 '+switchProjectName+' 项目');
					}

					gulp.src('archive/'+ archiveName +'/**/*',{ dot: true })
						.pipe(gulp.dest('app'))
						.on('end',function () {
							projectInfo.projectName = switchProjectName;
							wjson.sync('projectInfo.json',projectInfo);
							console.log('已切换到项目 ' + switchProjectName);
							gulp.start(['Tmaker','sass','js','asset','preview-data']);
							console.log('已完成项目初始化 ')
						});
				});
		}
		return;
	}
	
	if(projectInfo.projectName == 'null'){
		console.log('\n 请先执行 "gulp --switch projectName" 新建一个项目');
		return ;
	}
	
	// 显示当前项目列表
	if(yargs.argv.show)
	{
		console.log('\n 当前项目 :\n');
		console.log(' * ' + projectInfo.projectName + '\n\n 已存档项目 :\n');
		fs.readdirSync('archive/').forEach(function(item) {
			
			if(item == '_init') {return;}			
			console.log('   ' + item);
		})
		return console.log('\n 已列出所有项目\n');
	}
	
	if(yargs.argv.archive){		
		console.log('\n 开始存档 ' + projectInfo.projectName + ' 项目');
		gulp.src('archive/' + projectInfo.projectName + '/**/*')
			.pipe(rm({async:false}));
		
		gulp.src('app/**/*')
			.pipe(plumber())
			.pipe(gulp.dest('archive/'+ projectInfo.projectName));
			
		return console.log('\n 已列存档当前项目\n');
	}	
	
	gulp.start('serve');
});

gulp.task('default',['switch']);
