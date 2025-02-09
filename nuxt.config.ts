// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxtjs/color-mode', '@nuxt/icon', '@vueuse/nuxt', '@nuxtjs/seo', '@nuxt/content', 'nuxt-umami'],
  future: {
    compatibilityVersion: 4,
  },
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
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
    // Enable dynamic OG image generation
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
    }
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
    // proxy: 'cloak',
    // excludeQueryParams: false,
    // domains: ['cool-site.app', 'my-space.site'],
    // customEndpoint: '/my-custom-endpoint',
    // enabled: false,
    // logErrors: true,
  },
})