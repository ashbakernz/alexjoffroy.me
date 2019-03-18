const path = require('path')
const fs = require('fs')

module.exports = {
  mode: 'universal',

  env: {
    baseUrl: 'https://alexjoffroy.me',
    recaptcha: {
      key: process.env.SITE_RECAPTCHA_KEY || 'SITE_RECAPTCHA_KEY'
    }
  },

  head: {
    htmlAttrs: {
      lang: 'fr'
    },
    bodyAttrs: {
      class: 'font-body bg-primary'
    },
    title: 'AlexJoffroy.me',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'robots', name: 'robots', content: 'noindex,nofollow' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: 'AlexJoffroy.me'
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      { hid: 'twitter:site', name: 'twitter:site', content: '@AlexJoffroy' },
      {
        hid: 'twitter:creator',
        name: 'twitter:creator',
        content: '@AlexJoffroy'
      },
      {
        hid: 'msapplication-TileColor',
        name: 'msapplication-TileColor',
        content: '#da532c'
      },
      { hid: 'theme-color', name: 'theme-color', content: '#ffffff' }
    ],
    link: [
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png'
      },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'mask-icon', color: '#5bbad5', href: '//safari-pinned-tab.svg' },
      { rel: 'manifest', href: '/site.webmanifest' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Quicksand:300,400,700|Source:300,400,700'
      }
    ]
  },

  css: ['~/assets/scss/app.scss'],

  modules: [
    [
      'nuxt-i18n',
      {
        locales: [
          { code: 'en', iso: 'en-US', name: 'English', file: 'en.js' },
          { code: 'fr', iso: 'fr-FR', name: 'Français', file: 'fr.js' }
        ],
        defaultLocale: 'en',
        lazy: true,
        langDir: 'translations/',
        parsePages: false,
        pages: {
          about: {
            en: '/about',
            fr: '/a-propos'
          }
        }
      }
    ]
  ],

  generate: {
    subFolders: true,
    routes() {
      return fs
        .readdirSync(`contents/blog-posts`)
        .map(locale => {
          return fs
            .readdirSync(`contents/blog-posts/${locale}`)
            .map(filename => {
              let [_, publishedAt, slug] = filename.match(
                /(\d{4}-\d{2}-\d{2}).(.+)\.md$/
              )

              return {
                route:
                  locale != 'en'
                    ? `/${locale}/blog/${slug}-${+new Date(publishedAt) / 1000}`
                    : `/blog/${slug}-${+new Date(publishedAt) / 1000}`
              }
            })
        })
        .flat()
        .concat(['/', '/blog', '/contact', '/contact/success'])
    }
  },

  build: {
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      config.module.rules.push({
        test: /\.md$/,
        include: path.resolve(__dirname, 'contents'),
        loader: 'frontmatter-markdown-loader',
        options: {
          vue: {
            root: 'content'
          }
        }
      })

      config.module.rules.find(
        rule => ('' + rule.test).indexOf('(png|jpe?g|gif|svg|webp)') > -1
      ).test = /\.(png|jpe?g|gif|webp)$/

      config.module.rules.push({
        test: /\.svg$/,
        loader: 'vue-svg-loader'
      })
    },
    vendor: ['headroom.js', 'noty']
  }
}
