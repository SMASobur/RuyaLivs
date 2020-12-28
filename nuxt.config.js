import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://cdn.jsdelivr.net/npm/v-stripe-elements@v1.2.0/dist/v-stripe-elements.min.css' }

    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#333333' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/notifier.js',
    '~/plugins/apollo-error-handler.js',
    '~/plugins/apollo-watch-loading-handler.js',
    // { src: '~/plugins/mask-input.client.js' },
    { src: '~/plugins/v-stripe-elements.js', mode: 'client' },
    { src: '~/plugins/vuex-persist', ssr: false },
    // { src: '~/plugins/localStorage.js', ssr: false }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/moment',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // apollo for nuxt
    '@nuxtjs/apollo',

    'cookie-universal-nuxt',
    ['nuxt-gmaps', {
      key: 'AIzaSyA7hcdnNTKyEyxGiCtQ_FTRNU-lQktGeac',
      libraries: ['places']
    }],
    ['nuxt-google-maps-module', {
      /* module options */
      key: 'AIzaSyA7hcdnNTKyEyxGiCtQ_FTRNU-lQktGeac', // Default
    }]

  ],

  script: [
    {
      src: 'https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyA7hcdnNTKyEyxGiCtQ_FTRNU-lQktGeac'
    }
  ],

  // server: {
  //   port: 3000, // default: 3000
  //   host: '0.0.0.0' // default: localhost
  // },/
  apollo: {

    // token for user auth
    tokenName: 'token',
    defaultOptions: {
      // See 'apollo' definition
      // For example: default query options
      // $query: {
      //   fetchPolicy: 'no-cache',
      // },

    },

    // optional
    watchLoading: '~/plugins/apollo-watch-loading-handler.js',
    // optional
    errorHandler: '~/plugins/apollo-error-handler.js',


    clientConfigs: {
      default: {
        // required
        // httpEndpoint: 'http://localhost:4000/graphql',
        httpEndpoint: 'https://nawras-server.herokuapp.com/graphql',
        // optional
        // override HTTP endpoint in browser only
        // browserHttpEndpoint: '/graphql',
        // // optional
        // // See https://www.apollographql.com/docs/link/links/http.html#options
        httpLinkOptions: {
          fetchOptions: {
            mode: 'cors' //Cors Needed for external Cross origins, need to allow headers from server
          },
          credentials: "omit" //must be omit to support application/json content type
        }
      }
    },

    includeNodeModules: true
  },

  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.teal.darken1,
          accent: colors.blue.darken3,
          secondary: colors.blue.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: colors.teal.darken1,
          secondary: colors.blue.lighten1,
          accent: colors.blue.lighten1,

        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */

    babel: {
      presets({ isServer }) {
        return [
          [
            require.resolve('@nuxt/babel-preset-app'),
            // require.resolve('@nuxt/babel-preset-app-edge'), // For nuxt-edge users
            {
              buildTarget: isServer ? 'server' : 'client',
              corejs: { version: 3 }
            }
          ]
        ]
      }
    },

    extend(config, ctx) {

    }
  }
}
