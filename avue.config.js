const webpack = require("webpack")

module.exports = {
    parallel: false,
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                cash: "cash-dom",
                Popper: "@popperjs/core",
            }),
        ],
    },
    transpileDependencies: [/ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/],
    chainWebpack: config => {
        config.module.rules.delete("eslint")
    },
}
