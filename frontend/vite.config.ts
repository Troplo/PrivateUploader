// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import graphql from "@rollup/plugin-graphql";
import Icons from "unplugin-icons/vite";

// Utilities
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import ViteVersion from "@flowinity/vite-version";
import path from "path";
import * as fs from "fs";

const resolve = (file: string) => {
  return path.resolve(__dirname, file);
};

// https://vitejs.dev/config/

const config = {
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/tpu-main.[hash].js",
        chunkFileNames: "assets/tpu-chunk.[hash].js",
        assetFileNames: "assets/tpu-asset.[hash].[ext]"
      }
    },
    sourcemap: false,
    emptyOutDir: true
  },
  plugins: [
    Icons({
      autoInstall: true
    }),
    graphql(),
    //@ts-ignore
    ViteVersion.default(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        navigateFallbackDenylist: [
          /^\/i\/.*/,
          /^\/api\/.*/,
          /^\/\.well-known\/.*/,
          /^\/graphql/,
          /^\/gateway/,
          /^\/socket.io/,
          /^\/privacy.html/,
          /^\/terms.html/,
          /^\/endpoints.json/,
          /^\/endpoints.local.json/
        ]
      },
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "safari-pinned-tab.svg",
        "site.webmanifest",
        "mstile-310x310.png",
        "mstile-310x150.png",
        "mstile-150x150.png",
        "favicon.png",
        "favicon-gold.png",
        "favicon-32x32.png",
        "favicon-16x16.png",
        "android-chrome-192x192.png",
        "android-chrome-512x512.png",
        "browserconfig.xml"
      ],
      manifest: {
        name: "Flowinity",
        short_name: "Flowinity",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/android-chrome-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/android-chrome-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/apple-touch-icon-60x60.png",
            sizes: "60x60",
            type: "image/png"
          },
          {
            src: "/apple-touch-icon-76x76.png",
            sizes: "76x76",
            type: "image/png"
          },
          {
            src: "/apple-touch-icon-120x120.png",
            sizes: "120x120",
            type: "image/png"
          },
          {
            src: "/apple-touch-icon-152x152.png",
            sizes: "152x152",
            type: "image/png"
          },
          {
            src: "/apple-touch-icon-180x180.png",
            sizes: "180x180",
            type: "image/png"
          },
          {
            src: "/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png"
          },
          {
            src: "/favicon-16x16.png",
            sizes: "16x16",
            type: "image/png"
          },
          {
            src: "/favicon-32x32.png",
            sizes: "32x32",
            type: "image/png"
          },
          {
            src: "/msapplication-icon-144x144.png",
            sizes: "144x144",
            type: "image/png"
          },
          {
            src: "/mstile-150x150.png",
            sizes: "150x150",
            type: "image/png"
          }
        ],
        theme_color: "#101010",
        background_color: "#101010",
        display: "standalone"
      }
    }),
    vue({
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true
    })
  ],
  define: {
    "process.env": {},
    "import.meta.env.FLOWINITY_ENDPOINTS": process.env.FLOWINITY_ENDPOINTS
      ? `"${process.env.FLOWINITY_ENDPOINTS}"`
      : '"/endpoints.local.json"'
  },
  resolve: {
    alias: [
      {
        find: /^@flowforms-frontend\/(.*)/,
        replacement: resolve("../modules/FlowForms/frontend/src/$1")
      },
      { find: /^@\/(.*)/, replacement: resolve("./src/$1") }
    ],
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"]
  },
  server: {
    port: 3000,
    proxy: {
      "/api/v3": "http://localhost:34582",
      "/i/": "http://localhost:34582",
      "/socket.io": {
        target: "http://localhost:34582",
        ws: true,
        secure: true,
        changeOrigin: true
      },
      "/graphql": {
        target: "http://localhost:34583",
        ws: true,
        secure: true,
        changeOrigin: true
      },
      "/gateway": {
        target: "http://localhost:34582",
        ws: true,
        secure: true,
        changeOrigin: true
      },
      "/metrics": "http://localhost:34583",
      "/ok": "http://localhost:34583",
      "/.well-known": "http://localhost:34582"
    },
    https: undefined,
    warmup: {
      clientFiles: ["./src/**/*.ts", "./src/**/*.vue"]
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    server: {
      deps: {
        inline: ["vuetify"]
      }
    }
  }
};

if (process.env.USE_SSL_INTERNAL === "true") {
  //@ts-ignore
  config.server.https = {
    key: fs.readFileSync("./vite.key"),
    cert: fs.readFileSync("./vite.crt")
  };
}

export default defineConfig(config);
