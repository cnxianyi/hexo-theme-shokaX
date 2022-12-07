/* global hexo */
const fs = require('hexo-fs')
// const url = require('url')

hexo.extend.generator.register('script', function (locals) {
  const log = hexo.log || console.log
  const config = hexo.config
  const theme = hexo.theme.config

  const env = require('../../package.json')

  const siteConfig = {
    version: env.version,
    hostname: config.url,
    root: config.root,
    statics: theme.statics,
    favicon: {
      normal: theme.assets + '/favicon.ico',
      hidden: theme.assets + '/failure.ico'
    },
    darkmode: theme.darkmode,
    auto_dark: theme.auto_dark,
    auto_scroll: theme.auto_scroll,
    js: {
      // valine: theme.vendors.js.valine,
      chart: theme.vendors.js.chart,
      copy_tex: theme.vendors.js.copy_tex,
      fancybox: theme.vendors.js.fancybox,
      echarts: theme.vendors.js.echarts
    },
    css: {
      valine: theme.css + '/comment.css',
      katex: theme.vendors.css.katex,
      mermaid: theme.css + '/mermaid.css',
      fancybox: theme.vendors.css.fancybox
    },
    loader: theme.loader,
    search: null,
    valine: theme.valine,
    quicklink: {
      timeout: theme.quicklink.timeout,
      priority: theme.quicklink.priority
    }
  }

  if (config?.algolia) {
    siteConfig.search = {
      appID: config.algolia.appId,
      apiKey: config.algolia.apiKey,
      indexName: config.algolia.indexName,
      hits: theme.search.hits
    }
  }

  if (theme?.audio) {
    siteConfig.audio = theme.audio
  }

  let text = '';

  ['library', 'global', 'page', 'components'].forEach(function (item) {
    text += fs.readFileSync(`themes/shokaX/source/js/${item}.js`).toString()
  })
  if (!theme.experiments?.noPlayer) {
    text += fs.readFileSync('themes/shokaX/source/js/player.js').toString()
  }
  if (theme.fireworks && theme.fireworks.enable) {
    // text += fs.readFileSync('themes/shoka/source/js/_app/fireworks.js').toString()
    siteConfig.fireworks = theme.fireworks.color || ['rgba(255,182,185,.9)', 'rgba(250,227,217,.9)', 'rgba(187,222,214,.9)', 'rgba(138,198,209,.9)']
  }

  text = 'const CONFIG = ' + JSON.stringify(siteConfig) + ';' + text
  return {
    path: theme.js + '/app.js',
    data: function () {
      return hexo.render.renderSync({ text, engine: 'js' })
    }
  }
})
