const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.ts$/, loader: 'ts-loader'
            }
        ]
    },

    devtool: 'cheap-source-map',

    resolve: {
        extensions: ['.ts', '.js']
    },

    entry: './src/oculusx.ts',

    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },

    mode: 'production', //process.env.NODE_ENV === 'production' ? 'production' : 'development',

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    priority: -10,
                    test: /[\\/]node_modules[\\/]/
                }
            },

            chunks: 'async',
            minChunks: 1,
            minSize: 30000,
            name: true
        }
    }
};
