// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'motion-v/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: process.env.NUXT_SITE_URL || 'https://example.com'
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || '',
    supabaseDbUrl: process.env.SUPABASE_DB_URL || '',
    dbSsl: process.env.DB_SSL || 'auto',
    authSecret: process.env.AUTH_SECRET || process.env.SESSION_SECRET || '',
    authAllowedEmails: process.env.AUTH_ALLOWED_EMAILS || '',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || '',
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID || '',
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
    spotifyArtistId: process.env.SPOTIFY_ARTIST_ID || '',
    spotifyPlaylistIds: process.env.SPOTIFY_PLAYLIST_IDS || '',
    spotifyMarket: process.env.SPOTIFY_MARKET || 'US'
  },

  compatibilityDate: '2024-11-01',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true
    }
  },

  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit'
      ]
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
