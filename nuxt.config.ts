// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxtjs/color-mode', '@nuxt/icon', '@vueuse/nuxt', '@nuxtjs/seo', '@nuxt/content'],
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
    description: 'Generate and analyze your unique browser fingerprint. Check your digital privacy and understand how websites can track you.',
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
  app: {
    head: {
      script: process.env.NODE_ENV === 'production' ? [
        {
          defer: true,
          'data-website-id': process.env.UMAMI_WEBSITE_ID,
          src: `${process.env.UMAMI_HOST}/script.js`,
        }
      ] : []
    }
  },
  content: {
    highlight: {
      theme: 'github-dark',
    },
  },
})
