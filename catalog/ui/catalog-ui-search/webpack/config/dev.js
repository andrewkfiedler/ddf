var webpack = require('webpack');
var merge = require('webpack-merge');

var base = require('./base');

module.exports = merge.smart(base, {
    entry: [
        'webpack/hot/only-dev-server',
        'stack-source-map/register',
        'console-polyfill'
    ],
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loaders: ['react-hot']
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});
