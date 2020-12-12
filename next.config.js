const { nextI18NextRewrites } = require('next-i18next/rewrites')
const localeSubpaths = {
  fi: 'fi',
  en: 'en',
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
