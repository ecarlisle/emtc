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
const cssPath = path.resolve(buildPath, 'scss');
const jsPath = path.resolve(buildPath, 'js');
const imgPath = path.resolve(buildPath, 'img');

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
				test: /\.handlebars$/,
				use: [
					{
						loader: 'handlebars-loader'
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
		main: [
			'normalize.css/normalize.css',
			'./scss/main.scss',
			'./templates/header.handlebars',
			'./js/main.js',
		],
		customer: [
			'./js/customer.js',
		],
		editor: [
			'./js/editor.js',
		],
		inventory: [
			'./templates/inventory.handlebars',
			'./js/inventory.js',
		],
	},
	output: {
		path: path.resolve(buildPath),
		filename: './js/[name].js',
	},
	externals: {
		jquery: 'jQuery'
	},
	watch: true,
	devtool: 'source-map',
	plugins: [
		new CleanWebpackPlugin([buildPath], {}),
		new ExtractTextPlugin('./css/main.css'),
		new CopyWebpackPlugin([
			{
				from: path.resolve(sourcePath, 'html'),
				to: buildPath,
			},
			{
				from: path.resolve(sourcePath, 'img'),
				to: imgPath,
			},
		]),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
		}),
	],
};
