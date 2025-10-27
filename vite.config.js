import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';
import { VitePWA } from 'vite-plugin-pwa';

const routes = [
  '/', '/about-us', '/privacyPolicy', '/termsConditions', '/contact-us',
  '/refundPolicy', '/verify-email', '/about', '/privacy-policy',
  '/refund-policy', '/terms-conditions', '/profile', '/contact',
  '/settings', '/wallet', '/qa', '/answer-analysis', '/refer',
  '/signup', '/login', '/forgot-password', '/logout', '/subjects',
  '/subscription', '/billing', '/invoice', '/payment-status',
  '/bookOrder-Status', '/books', '/cart', '/my-order', '/videos',
  '/video', '/contest', '/exam', '/bookingStatus', '/quiz',
  '/current-affairs-mcq', '/daily-current-affairs', '/current-affairs'
];

export default defineConfig({
  plugins: [
    react(),

    // ✅ Sitemap Plugin
    Sitemap({
      hostname: 'https://earnq.in',
      routes,
      changefreq: 'daily',
      priority: 0.8
    }),

    // ✅ PWA Plugin
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      selfDestroying: true, // 🔥 old SW clear automatically
      devOptions: {
        enabled: true,
        type: 'module',
      },
      includeAssets: [
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'offline.html'
      ],
      manifest: {
        name: 'EarnQ',
        short_name: 'EarnQ',
        description: 'EarnQ Learning and Earning App',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icon-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,json}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/earnq\.in\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'earnq-pages',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24
              },
              cacheableResponse: {
                statuses: [0, 200],
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\.earnq\.in\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'earnq-api',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24
              },
              cacheableResponse: {
                statuses: [0, 200],
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200],
              }
            }
          }
        ],
        // ✅ Offline fallback page (only when offline)
        navigateFallback: '/offline.html',
        navigateFallbackAllowlist: [
          /^\/$/, 
          /^\/(books|profile|contest|cart|subjects|videos|quiz).*$/ // only SPA routes
        ]
      }
    })
  ],

  server: {
    proxy: {
      '/socket.io': {
        target: 'https://earnq.in',
        ws: true,
        changeOrigin: true
      }
    }
  }
});
