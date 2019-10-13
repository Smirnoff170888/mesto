const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isDev = (process.env.NODE_ENV === 'development');
const isProd = (process.env.NODE_ENV === 'production');

module.exports = {
    entry: { main: './src/js/wentry.js' },
    output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: { loader: "babel-loader" },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [(isDev ? 'style-loader' : MiniCssExtractPlugin.loader), 'css-loader', 'postcss-loader']
            },
            {
                test: /\.(png|jp?g|gif|ico|svg)$/,
                use: [
                     'file-loader?name=images/[name].[ext]',
                     {
                         loader: 'image-webpack-loader',
                         options: {
                            mozjpeg: {
                              progressive: true,
                              quality: 65
                            },
                            optipng: {
                              enabled: false,
                            },
                            pngquant: {
                              quality: [0.65, 0.90],
                              speed: 4
                            },
                            gifsicle: {
                              interlaced: false,
                            },
                            webp: {
                              quality: 75
                            }
                          }
                     },
                ]
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/i,
                loader: 'file-loader?name=vendor/[name].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new MiniCssExtractPlugin({
            filename: 'style.[contenthash].css'
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                    preset: ['default', {
                        discardComments: {
                            removeAll: true
                        }
                    }],
            },
            canPrint: true
       }),
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            template: './src/index.html',
            filename: 'index.html',
            minify: {
                removeComments: isProd,
                collapseWhitespace: isProd,
                removeAttributeQuotes: isProd
              },
          }),
        new WebpackMd5Hash()
    ]
}