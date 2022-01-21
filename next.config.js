const withPlugins = require('next-compose-plugins');
const graphql = require('next-plugin-graphql')

const sassOptions = {
  includePaths: ['./components', './pages'],
  prependData: `
    @use "sass:math";
    @import "./styles/partials/mediaqueries"; 
    @import "./styles/partials/styles";
    @import "./styles/partials/variables";
    @import "./styles/partials/fonts";
  `
}
const nextOptions = {
  devIndicators: {
    buildActivity: false
  },
  experimental: {
    scrollRestoration: true
  },
  onDemandEntries: { maxInactiveAge: 60 * 1000, pagesBufferLength: 10000}
}

const config = withPlugins([graphql], { sassOptions, ...nextOptions })
module.exports = config