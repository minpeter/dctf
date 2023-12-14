const path = require('path')

export default (config, env, helpers) => {
  if (env.production) {
    // Disable sourcemaps
    config.devtool = false
  } else {
    config.devServer.proxy = [
      {
        path: '/api/**',
        target: process.env.API_URL || 'http://localhost:3000',
        changeOrigin: true,
        changeHost: true
      }
    ]
  }

  config.resolveLoader.modules.unshift(
    path.resolve(__dirname, 'client/lib/loaders')
  )

  // Remove .svg from preconfigured webpack file-loader
  ;['file-loader', 'url-loader']
    .flatMap((name) => helpers.getLoadersByName(config, name))
    .forEach((entry) => {
      entry.rule.test =
        /\.(woff2?|ttf|eot|jpe?g|png|webp|gif|mp4|mov|ogg|webm)(\?.*)?$/i
    })

  config.module.rules.push({
    test: /\.svg$/,
    loader: 'preact-svg-loader'
  })
}
