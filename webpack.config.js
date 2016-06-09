var path = require('path'),
    failPlugin = require('webpack-fail-plugin'),
    copyWebpackPlugin = require('copy-webpack-plugin'),
    webpack = require('webpack'),
    ExtractPlugin = require('extract-text-webpack-plugin')
    ;
//var loaders = require('./webpack.loaders');

// Edit those vars
var env = process.env.WEBPACK_ENV;
var isProduction = (env === 'production');

var sourcePath = path.resolve('./src/');
var outputPath = isProduction ? path.resolve('./dist/') : path.resolve('./build/');

var serverPort = 3001;


// Global config
var config = {
    context: sourcePath,
    devtool: isProduction ? 'source-map' : 'eval',
    devServer: {
        host: 'localhost',
        port: serverPort,
        contentBase: './build',
        inline: true,
        hot: true,
        progress: true,
        stats: {colors: true}
    },
    entry: {
        main_dealer_app: ['./js/main_dealer_app'],
        fetch: ['whatwg-fetch'],
        //react: ['react', 'react-dom']
    },
    output: {
        path: outputPath,
        filename: '[name].js'
        //publicPath: '/assets/'
    },
    /*
    externals: {
        // Use external version of React
        "react": "React",
        "react-dom": "ReactDOM"
    },*/
    resolve: {
        extensions: ['', '.js', '.jsx', '.css', '.sass', '.html']
    },
    /* Only if context gives the global path (join instead of resolve)
    resolveLoader: {
        root: path.join(__dirname, 'node_modules')
    },*/

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
            }
        }),

        failPlugin,
        // Import polyfills for Promises and whatwg fetch
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
            'es6-promise': 'es6-promise'
        }),

        new copyWebpackPlugin([
            {from: 'html', to: outputPath}
        ])

    ],
    serverPort : serverPort,
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'stage-0', 'react', 'react-hmre']
                }
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file'
            },
            {
                test: /\.(woff|woff2)$/,
                loader: 'url?prefix=font/&limit=5000'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/octet-stream'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=image/svg+xml'
            },
            {
                test: /\.gif/,
                loader: 'url-loader?limit=10000&mimetype=image/gif'
            },
            {
                test: /\.jpg/,
                loader: 'url-loader?limit=10000&mimetype=image/jpg'
            },
            {
                test: /\.png/,
                loader: 'url-loader?limit=10000&mimetype=image/png'
            }
        ]
    }

}

if (!isProduction) {
    // Development mode
    config.entry.client = 'webpack-dev-server/client?http://localhost:' + serverPort;
    config.entry.main_dealer_app.push('webpack/hot/only-dev-server');
    config.plugins.push(new webpack.HotModuleReplacementPlugin())

    // entries
    // config.entry['webpack-dev-server'] = 'webpack-dev-server/client?http://localhost:' + serverPort + '/';
 //   config.entry['webpack-hot'] = 'webpack/hot/dev-server';

    //console.log('entry', config.entry);
    // plugins
   // config.plugins.push(new webpack.HotModuleReplacementPlugin());

} else {
    // Production mode
    // new webpack.optimize.CommonsChunkPlugin('react', '[name].[chunkhash].js'),

    // Add uglify plugin

    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    );
}

module.exports = config;