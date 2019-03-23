const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'src/ts/index.ts'),
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /.sass/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Floopy Bird',
            template: path.resolve(__dirname, 'src/index.html')
        })
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};