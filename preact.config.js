export default (config, env, helpers) => {
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
