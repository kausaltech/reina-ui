const { nextI18NextRewrites } = require('next-i18next/rewrites')
const localeSubpaths = {
  en: 'en',
  fi: 'fi',
}
const path = require('path')

module.exports = {
  rewrites: async () => nextI18NextRewrites(localeSubpaths),
  publicRuntimeConfig: {
    localeSubpaths,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}
