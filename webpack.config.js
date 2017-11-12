'use strict';

// Node native modules
const path = require('path');

// To access native Webpack plugins
const webpack = require('webpack');

// Webpack plugins
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Paths
const sourcePath = path.resolve(__dirname, 'src');
const buildPath = path.resolve(__dirname, 'static');
const cssPath = path.resolve(buildPath, 'css');
const jsPath = path.resolve(buildPath, 'js');

module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				enforce: 'pre',
				exclude: /node_modules/,
				use: [
					{
						loader: 'jshint-loader'
					}
				],
			},
			{
				test: /\.(scss|css)$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								sourceMap: true,
								minimize: false,
								importLoaders: 2,
							},
						},
						{
							loader: 'postcss-loader',
							options: {
								plugins: () => [
									require('autoprefixer')(),
								],
								sourceMap: true,
							},
						},
						{
							loader: 'sass-loader',
							options: {
								outputStyle: 'expanded',
								sourceMap: true,
							}
						},
					],
				}),
			},
		], // :rules
	},
	context: sourcePath,
	entry: {
		app: [
			'normalize.css/normalize.css',
			'./scss/main.scss',
			'./scss/wee-grid.css',
			'jquery',
			'./js/main.js',
		],
	},
	output: {
		path: path.resolve(buildPath),
		filename: './js/main.js',
	},
	watch: true,
	devtool: 'source-map',
	plugins: [
		new CleanWebpackPlugin([buildPath], {}),
		new ExtractTextPlugin('./css/main.css'),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
		}),
	],
};
