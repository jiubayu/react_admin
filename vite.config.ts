import path from 'node:path';

import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import {vanillaExtractPlugin} from '@vanilla-extract/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons';
import {visualizer} from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_APP_BASE_PATH || '/';
  const isProduction = mode === 'production';

  return {
    base,
    plugins: [
      react({
        // 添加 React 插件的优化配置
        babel: {
          parserOpts: {
            plugins: ['decorators-legacy', 'classProperties'],
          },
        },
      }),

      // Write your styles in TypeScript (or JavaScript) with locally scoped class names and CSS Variables,
      // then generate static CSS files at build time.
      vanillaExtractPlugin({
        identifiers: ({debugId}) => `${debugId}`,
      }),

      // Give vite the ability to resolve imports using TypeScript's path mapping.
      tsconfigPaths(),

      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),

      // Visualize and analyze your Rollup bundle to see which modules are taking up space.
      isProduction &&
        visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
          template: 'treemap', // 使用树形图更直观
        }),
    ].filter(Boolean),

    server: {
      open: true,
      host: true,
      port: 3002,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false,
        },
      },
    },

    build: {
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: !isProduction,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-core': ['react', 'react-dom', 'react-router'],
            'vendor-ui': [
              'antd',
              '@ant-design/icons',
              '@ant-design/cssinjs',
              'framer-motion',
              'styled-components',
            ],
            'vendor-utils': [
              'axios',
              'dayjs',
              'i18next',
              'zustand',
              '@iconify/react',
            ],
            'vendor-charts': ['apexcharts', 'react-apexcharts'],
          },
        },
      },
    },

    // 优化依赖预构建
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router',
        'antd',
        '@ant-design/icons',
        'axios',
        'dayjs',
        'i18next',
        'apexcharts',
        'react-apexcharts',
      ],
      exclude: ['@iconify/react'],
    },

    // esbuild 优化配置
    esbuild: {
      drop: isProduction ? ['console', 'debugger'] : [],
      legalComments: 'none',
      target: 'esnext',
      // minify: isProduction,
    },
  };
});
