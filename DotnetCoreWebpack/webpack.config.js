const path = require('path');
const webpack = require('webpack');
var fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// Mode is captured from the --mode production argument in package.json scripts build:prod
const production = process.argv.indexOf('production') !== -1;

module.exports = {
    entry: {
        // What you want to minify
        home: './Scripts/home/home-page.ts',
        contact: './Scripts/contact/contact-page.ts',
        index: "./Scripts/react/index.tsx"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    optimization: {
        // This will ensure that js packages greater than 30kb used
        //   in at least minChunks other js files via imports
        //   will be bundled just once.  Node modules is done by
        //   default, so these are for project specific modules.
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'vendor',
                    chunks: 'initial',
                    minChunks: 2
                }
            }
        }
    },
    plugins: [
        // Deletes your js folder before build so you always start fresh!
        new CleanWebpackPlugin(['wwwroot/js/']),
        // Output stats.json to /Webpack with filename detials after webpack has finished
        function () {
            this.plugin("done", function (stats) {
                var wpPath = path.join(__dirname, "Webpack");
                if (fs.existsSync(wpPath) === false) {
                    fs.mkdirSync(wpPath);
                }
                fs.writeFileSync(
                    path.join(wpPath, "stats.json"),
                    JSON.stringify(stats.toJson()));
            });
        },
    ],
    output: {
        // Webpack recognized [chunkhash] and will generate a random string
        //  to append to your file name so that the browser you use
        //  will always catch the latest code in the prod build.
        filename: (production) ? "[name].[chunkhash].js" : "[name].js",
        // Where the bundled code goes
        path: path.resolve(__dirname, 'wwwroot/js/')
    }
};