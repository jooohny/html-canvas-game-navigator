const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const PATHS = {
    src: path.join(__dirname, './src'),
    dist: path.join(__dirname, './dist'),
    assets: path.join(__dirname, './src/assets'),
}

module.exports = {
    entry: `${PATHS.src}/main.js`,
    mode: 'development',
    output: {
        path: PATHS.dist,
        publicPath: '/',
        filename: 'app.js',
    },
    devServer: {
        overlay:  true,
    },
    resolve: {
        alias: {
            assets: path.resolve(__dirname, './assets'),
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/',
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.scss$/,
                use: [
                  'vue-style-loader',
                  'css-loader',
                  'sass-loader'
                ]
              }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.join(__dirname, 'src', 'assets'), to: 'assets' },
            ],
        }),
    ],
}

