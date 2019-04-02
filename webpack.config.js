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
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {},
                  } ,
                ],
            },
            {
                test: /three\/examples\/js/,
                use: 'imports-loader?THREE=three'
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
        alias: {
            'three-examples': path.join(__dirname, './node_modules/three/examples/js')
        }
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