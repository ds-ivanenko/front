import 'dotenv/config';
import {src, dest, parallel, watch, task} from 'gulp';
import rename from 'gulp-rename';
import babel from 'gulp-babel';
import browserSync from 'browser-sync';
import * as sass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleancss from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import svgsprite from 'gulp-svg-sprite';
import webpackStream from 'webpack-stream';
import plumber from 'gulp-plumber';
import webpackConfig from './webpack.config.js';

const browserSyncInstance = browserSync.create();
const sassCompiler = gulpSass(sass);

// Define paths
const paths = {
	scripts: {
		src: 'assets/src/js/**/*.js',
		dest: 'assets/dist/js'
	},

	styles: {
		src: 'assets/src/scss/**/*.scss',
		dest: 'assets/dist/css'
	},

	svg: {
		src: 'assets/src/svg-icons/**/*.svg',
		dest: 'assets/dist/images'
	},
	images: {
		src: 'assets/src/images/**/*',
		dest: 'assets/dist/images'
	},
	vendor: {
		src: 'assets/src/vendor/**/*',
		dest: 'assets/dist/vendor'
	},
	php: {
		src: './**/*.php'
	}
};

// Custom Plumber function for catching errors
function customPlumber(errTitle) {
	return plumber({
		errorHandler(err) {
			console.error(`Error (${ errTitle }): ${ err.message }`);
			this.emit('end');
		}
	});
}

// Browsersync
function browsersync(done) {
	browserSyncInstance.init({
		proxy: {
			target: process.env.BROWSERSYNC_PROXY,
			ws: true
		}
	});
	done();
}

task('browsersync', browsersync);

// Scripts
function scripts() {
	return src(paths.scripts.src)
		.pipe(customPlumber('Error Running Scripts'))
		.pipe(webpackStream(webpackConfig))
		.pipe(dest(paths.scripts.dest))
		.pipe(browserSyncInstance.stream());
}

task('scripts', scripts);

// Vendors
function vendor() {
	return src(paths.vendor.src)
		.pipe(dest(paths.vendor.dest));
}

task('vendor', vendor);

// Styles
function styles() {
	return src(paths.styles.src)
		.pipe(customPlumber('Error Compiling Sass'))
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sassCompiler({outputStyle: 'compressed'}))
		.pipe(autoprefixer({overrideBrowserslist: ["defaults"], grid: false}))
		.pipe(cleancss(({level: {1: {specialComments: 0}}})))
		.pipe(sourcemaps.write('.'))
		.pipe(dest(paths.styles.dest))
		.pipe(browserSyncInstance.stream());
}

task('styles', styles);

// Images
function images() {
	return src(paths.images.src, {encoding: false})
		.pipe(dest(paths.images.dest));
}

task('images', images);

// SVG Sprite
function svgSprite() {
	return src(paths.svg.src)
		.pipe(svgsprite({
			mode: {
				symbol: true
			}
		}))
		.pipe(dest(paths.svg.dest));
}

task('svgSprite', svgSprite);

// Watch
function startwatch() {
	watch(paths.styles.src, styles);
	watch(paths.scripts.src, scripts);
	watch(paths.php.src).on('change', browserSyncInstance.reload);
	watch(paths.svg.src, svgSprite);
}

task('startwatch', startwatch);

// Default
task('default', parallel(
	'scripts',
	'vendor',
	'styles',
	'images',
	'svgSprite',
	'browsersync',
	'startwatch')
);