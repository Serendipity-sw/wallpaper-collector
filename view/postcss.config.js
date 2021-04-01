module.exports = {
  plugins: [
    require('precss'),
    require('autoprefixer'),
    require('postcss-use'),
    require('postcss-autoreset')({
      reset: {

      },
    }),
    require('postcss-modules'),
    require('postcss-initial'),
    require('postcss-preset-env'),
    require('postcss-utilities')({
      centerMethod: 'flexbox'
    }),
    require('postcss-short'),
    require('postcss-assets'),
    require('postcss-font-magician')({}),
    require('postcss-pxtorem')({
      rootValue: 100,
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: [],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0
    })
  ]
};
