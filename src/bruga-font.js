module.exports = {
  files: [
    './svgs/*.svg'
  ],
  fontName: 'bruga-portfolio-fonts',
  classPrefix: 'bruga-icon-',
  baseSelector: '.bruga-icon',
  types: ['woff2', 'woff', 'ttf', 'svg'],
  dest: '/fonts',
  cssDest: '/styles',
  cssTemplate: './svgs/bruga-font.css.hbs',
  fileName: '[fontname].[ext]?[chunkhash]'
};
