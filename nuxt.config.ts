import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: [
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@vueuse/nuxt',
    '@nuxtjs/seo',
    '@nuxt/content',
    'nuxt-umami',
  ],

  css: ['~/assets/css/tailwind.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },

  colorMode: {
    classPrefix: '',
    classSuffix: '',
  },

  site: {
    url: 'https://trackme.dev/',
    name: 'Browser Fingerprint',
    description: 'Generate and analyze your unique browser fingerprint. Understand how websites can track you.',
    defaultLocale: 'en',
  },

  ogImage: {
    enabled: true,
    defaults: {
      component: 'NuxtSeo',
      width: 1200,
      height: 630,
    },
  },

  runtimeConfig: {
    public: {
      umamiWebsiteId: process.env.UMAMI_WEBSITE_ID,
      umamiHost: process.env.UMAMI_HOST,
    },
  },

  content: {
    highlight: {
      theme: 'github-dark',
    },
  },

  umami: {
    id: process.env.UMAMI_WEBSITE_ID,
    host: process.env.UMAMI_HOST,
    autoTrack: true,
    ignoreLocalhost: true,
    useDirective: true,
  },

  app: {
    head: {
      script: [
        {
          src: 'https://webry.leonkohli.de/api/script.js',
          defer: true,
          'data-site-id': '1',
        },
      ],
    },
  },
})
