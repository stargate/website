const jekyllEnv = process.env.JEKYLL_ENV || "development";

module.exports = {
  parser: 'postcss-scss',
  plugins: [
    require("autoprefixer"),
    ...(jekyllEnv != "development"
      ? [
        require("@fullhuman/postcss-purgecss")({
          content: ["!(_site|node_modules)/**/*.+(html|js|md)", "*.html"]
        }),
        require("cssnano")({ preset: "default" }),
      ]
      : [])
  ]
};