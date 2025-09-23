import tailwindcss from "@tailwindcss/vite";
import Aura from '@primeuix/themes/aura';
import fs from 'fs'
import { definePreset, palette } from '@primeuix/themes';

const values1 = palette('#d31145');
const customPreset = definePreset(Aura, {
  semantic: {
    colorScheme: {
      primary: {
        light:values1,
      },
      surface : Aura.semantic?.colorScheme?.light?.surface,
    },
  },
  extend: {
    variables: {
      scrollbarWidth: '0px',
    }
  } 
});


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false, componentInspector: false },
  devServer: {
    https: {
      key: fs.readFileSync('C:/laragon/etc/ssl/laragon.key', 'utf-8'),
      cert: fs.readFileSync('C:/laragon/etc/ssl/laragon.crt', 'utf-8'),
    },
    host: 'my.ribshack.test',
    port: 3000,
  },
  css: ['~/assets/css/main.css', 'primeicons/primeicons.css'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@primevue/nuxt-module',
    '@pinia/nuxt',
  ],
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  primevue: { 
    options: {
      ripple: true,
      theme: {
        preset: customPreset, 
        options: {
          darkModeSelector: '.fvck-dark-mode',
          ripple: true
        }
      }
    }
  }, 
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ],
  typescript: {
    typeCheck: true
  },
  runtimeConfig: {
    public: {
      stage: process.env.STAGE || 'development',
      loginUrl: process.env.LOGIN_URL || 'https://login.ribshack.test:3001',
      iamApiUrl: process.env.IAM_API_URL || 'https://iam.ribshack.test', 
      hrisApiUrl: process.env.HRIS_API_URL,
      sessionDomain: process.env.SESSION_DOMAIN,
      oauthClientId: process.env.OAUTH_CLIENT_ID,
      passport: {
        baseUrl: process.env.PASSPORT_BASE_URL,
        clientId: process.env.PASSPORT_CLIENT_ID,
        redirectUri: process.env.PASSPORT_REDIRECT_URI,
      }
    },

  }

})