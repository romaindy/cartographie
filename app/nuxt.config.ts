// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  css: ['~/assets/styles/main.scss'],
  modules: ['@nuxtjs/tailwindcss', 'nuxt3-leaflet', '@nuxt/eslint'],
  eslint: {
    config: {
      stylistic: true,
    },
  },
  compatibilityDate: '2024-09-10',
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },
})
