var gulp 	= require('gulp'),
	sass 	= require('gulp-sass'),
	rename 	= require('gulp-rename'),
	prefix 	= require('gulp-autoprefixer'),
	bs 		= require('browser-sync'),
	del 	= require('del'),
	php2html = require("gulp-php2html");

var reloadTimer;
function reloadDelay(){
	clearTimeout(reloadTimer);
	reloadTimer = setTimeout(bs.reload, 300);
}

// CORE OPERATIONS
gulp.task('sass-main', function(){
	gulp.src('src/_/scss/base.scss')
		.pipe(sass({outputStyle: 'expanded'})
				.on('error', sass.logError))
		.pipe(prefix())
		.pipe(rename('s.css'))
		.pipe(gulp.dest('www/css/'))
		.pipe(bs.stream());

	gulp.src('src/_/scss/base.scss')
		.pipe(sass({outputStyle: 'expanded'})
				.on('error', sass.logError))
		.pipe(prefix())
		.pipe(rename('s.css'))
		.pipe(gulp.dest('src/css/'));

	gulp.src('src/_/scss/demo-page.scss')
		.pipe(sass({outputStyle: 'expanded'})
				.on('error', sass.logError))
		.pipe(gulp.dest('www/css/'));

	gulp.src('src/_/scss/demo-page.scss')
		.pipe(sass({outputStyle: 'expanded'})
				.on('error', sass.logError))
		.pipe(gulp.dest('src/css/'));
});
gulp.task('sass-themes', function(){
	gulp.src('src/_/scss/theme_*.scss')
		.pipe(sass({outputStyle: 'expanded'})
				.on('error', sass.logError))
		.pipe(gulp.dest('www/css/themes'))
		.pipe(bs.stream());

	gulp.src('src/_/scss/theme_*.scss')
		.pipe(sass({outputStyle: 'expanded'})
				.on('error', sass.logError))
		.pipe(gulp.dest('src/css/themes'));
})
gulp.task('php2html', function() { 
	gulp.src("src/*.php").pipe(php2html()).pipe(gulp.dest('html/'));
	gulp.src("src/css/**/*").pipe(gulp.dest('html/css/'));
	gulp.src('src/js/**/*').pipe(gulp.dest('html/js/'));
	gulp.src('src/fonts/**/*').pipe(gulp.dest('html/fonts/'));
	gulp.src('src/img/**/*').pipe(gulp.dest('html/img/'));
	gulp.src('src/*.ico').pipe(gulp.dest('html/'));
});

gulp.task('js', function(){
	gulp.src('src/js/**/*.js')
		.pipe(gulp.dest('www/js'));
});
gulp.task('js-watch', ['js'], reloadDelay);

gulp.task('html', function(){
	gulp.src(['src/**/*.html', 'src/**/*.php'])
		.pipe(gulp.dest('www/'));
});
gulp.task('html-watch', ['html'], reloadDelay);

gulp.task('fonts', function(){
	gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('www/fonts'));
});
gulp.task('img', function(){
	gulp.src('src/img/**/*')
		.pipe(gulp.dest('www/img/'));
	gulp.src('src/*.ico')
		.pipe(gulp.dest('www/'));
});
gulp.task('static-watch', ['fonts', 'img'], reloadDelay);
// END OF CORE OPERATIONS

// WRAPPING UP: initial compile and start watchers
gulp.task('default', ['sass-main', 'sass-themes', 'html', 'js', 'img', 'fonts'], function(){
	bs({
		proxy: 'http://localhost:8888/apparel-eng/www',
	});

	gulp.watch(['src/_/scss/base.scss',
				'src/_/scss/components/**/*.scss'], ['sass-main']);
	gulp.watch(['src/_/scss/theme_*.scss',
				'src/_/scss/themes/**/*.scss'], ['sass-themes']);
	gulp.watch(['src/js/**/*.js'], ['js-watch']);
	gulp.watch(['src/img/**/*', 'src/fonts/**/*'], ['static-watch']);
	gulp.watch(['src/**/*.html', 'src/**/*.php'], ['html-watch']);
});

gulp.task('build', ['sass-main', 'sass-themes', 'html', 'js', 'img', 'fonts']);