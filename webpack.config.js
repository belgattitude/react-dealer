var path = require('path'),
    failPlugin = require('webpack-fail-plugin'),
    copyWebpackPlugin = require('copy-webpack-plugin'),
    webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin')
    pkg = require('./package.json'),
    precss = require('precss'),
    autoprefixer = require('autoprefixer')
    ;

var banner = `
	${pkg.name} - ${pkg.description}
	Author: ${pkg.author}
	Version: v${pkg.version}
	Url: ${pkg.homepage}
	License(s): ${pkg.license}
`;


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
        dealer_locator: ['./js/dealer/dealer_locator'],
        fetch: ['whatwg-fetch'],
        react: ['react', 'react-dom']
    },
    output: {
        path: outputPath,
        filename: '[name].js',
        //library: 'DealerLocator',
        //libraryTarget: 'umd',
        //umdNamedDefine: true

        library: '[name]',
        libraryTarget: 'umd',
        umdNamedDefine: false
        //publicPath: '/assets/'
    },

    externals: {
        // Use external version of React
        //"react": "React",
        'react': {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react'
        },
        'react-dom': 'ReactDOM'
        //"whatwg-fetch": "whatwg-fetch"
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.ts', '.tsx', '.scss', '.css', '.html']
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
    postcss: function () {
        return {
            defaults: [precss, autoprefixer],
            cleaner:  [autoprefixer({ browsers: [['last 2 versions', 'ie 6-8', 'Firefox > 20']] })]
        };
    },
    sassLoader: {
        data: '@import "' + path.resolve(__dirname, 'src/theme/dealer_locator/default/_config.scss') + '";'
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    plugins: [
                        'transform-decorators-legacy',
                        'react-intl'/*, {
                         "messagesDir": path.resolve(__dirname, '/src/i18n'),
                         "enforceDescriptions": true
                         }*/
                    ],
                    presets: isProduction
                        ? ['es2015', 'stage-1', 'react']
                        : ['es2015', 'stage-1', 'react', 'react-hmre']
                }
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.scss|\.css$/,
                loader: isProduction
                    ? ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!postcss-loader!sass-loader?sourceMap')
                    : 'style!css!postcss-loader!sass'
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
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                loader: 'json'
            }
        ]
    }

}

if (!isProduction) {

    // Development mode
    config.entry.client = 'webpack-dev-server/client?http://localhost:' + serverPort;
    config.entry.main_dealer_app.push('webpack/hot/only-dev-server');
    config.plugins.push(new webpack.HotModuleReplacementPlugin());

    //config.plugins.push(new ExtractTextPlugin("[name].css", {allChunks: true}));
    // entries
    // config.entry['webpack-dev-server'] = 'webpack-dev-server/client?http://localhost:' + serverPort + '/';
 //   config.entry['webpack-hot'] = 'webpack/hot/dev-server';

    //console.log('entry', config.entry);
    // plugins
   // config.plugins.push(new webpack.HotModuleReplacementPlugin());

} else {
    // Production mode
    //new webpack.optimize.CommonsChunkPlugin('init.js'),
    //config.plugins.push(new webpack.optimize.CommonsChunkPlugin('common.js'));
    //new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"react", /* filename= */"react.bundle.js")
    //config.plugins.push(new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"dealer_locator", /* filename= */"dealer_locator.js"));
    config.plugins.push(new ExtractTextPlugin('[name].css', {allChunks: true}));

    config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin())
    // Add uglify plugin


    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    );

    config.plugins.push(new webpack.BannerPlugin( banner ));

}

module.exports = [

    config

];