import config from './config.js';

export default {
	mode: 'development',
	entry: config.entry,
	output: {
		filename: '[name].js',
		chunkFilename: '[path]/[name].[hash].js'
	},
	module: {
		rules: [{
			test: /\.(js)$/,
			exclude: /(node_modules)/,
			loader: 'babel-loader'
		}]
	},
	plugins: [],
	externals: {
		jquery: 'jQuery'
	},
	devtool: 'source-map'
};