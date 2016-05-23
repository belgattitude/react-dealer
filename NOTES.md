

# Start from scratch

## NPM create the package.json

npm init

npm install --save react react-dom;
npm install --save-dev babel-core babel-loader; 
npm install --save-dev babel-preset-es2015 babel-preset-react babel-preset-stage-0 babel-preset-react-hmre;
npm install --save-dev webpack webpack-dev-server webpack-fail-plugin; 
npm install --save-dev url-loader copy-webpack-plugin image-webpack-loader;
npm install --save-dev eslint eslint-loader babel-eslint;
npm install --save-dev eslint-plugin-import eslint-plugin-jsx-a11y eslint-config-airbnb;
npm install --save-dev autoprefixer-loader css-loader node-sass postcss-loader sass-loader style-loader;
npm install --save-dev extract-text-webpack-plugin;

## Global installs

npm install webpack-dev-server -g


## Create a webpack configuration

```js

var APP_DIR = path.resolve(__dirname, 'src/');
var BUILD_DIR = path.resolve(__dirname, 'dist/');

module.exports = {
    context: APP_DIR,
    entry: "./main.jsx",

    output: {
        filename: "app.js",
        path: BUILD_DIR",
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ["babel-loader"],
            }
        ],
    }
}


```

