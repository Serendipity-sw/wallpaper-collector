const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const EncodingPlugin = require('webpack-encoding-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const path = require('path');
const open = require('open');
const Webpack = require('webpack');

module.exports = {
    entry: './view/src/app.jsx',
    resolve: {
        extensions: [".js", ".json", ".jsx", ".css", ".pcss", ".ico", ".png", ".svg", ".jpg", ".jpeg", ".gif"],
        alias: {
            '@': path.join(__dirname, '../../src')
        }
    },
    output: {
        charset: true,
        path: path.resolve(__dirname, '../../../dist'),
        filename: './js/[name].bundle.js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            },
            {
                test: /\.pcss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ]
            },
            {
                test: /\.(?:ico|png|svg|jpg|jpeg|gif)$/i,
                loader: 'file-loader',
                options: {
                    name: './static/[name].[hash:8].[ext]',
                }
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                loader: 'file-loader',
                options: {
                    name: './static/[name].[hash:8].[ext]',
                }
            }
        ],
    },
    optimization: {
        usedExports: true,
        splitChunks: {
            minSize: 10000,
            maxSize: 250000,
        },
        minimizer: [
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: 'advanced',
                },
            }),
            new ParallelUglifyPlugin({
                cacheDir: '.cache/',
                test: /.js$/,
                workerCount: 2,
                uglifyJS: {
                    output: {
                        beautify: false,
                        comments: false
                    },
                    compress: {
                        drop_console: true,
                        collapse_vars: true,
                        reduce_vars: true
                    }
                },
            }),
        ]
    },
    plugins: [
        new Webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: './css/[name].bundle.css',
        }),
        new HtmlWebpackPlugin({
            title: 'webpack Boilerplate',
            template: path.resolve(__dirname, '../../template.html'),
            filename: 'index.html',
            inject: 'body'
        }),
        new EncodingPlugin({
            encoding: 'UTF-8'
        })
    ],
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        hot: true,
        open: false,
        after() {
            open('http://localhost:' + this.port);
        }
    }
};
