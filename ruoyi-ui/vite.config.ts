import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import viteCompression from 'vite-plugin-compression';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';
import mpaPlugin from 'vite-plugin-mpa-plus';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

export default defineConfig(({ mode, command }) => {
  return {
    base: '/',
    server: {
      proxy: {
        '/dev-api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: p => p.replace(/^\/dev-api/, ''),
        },
        '/profile': {
          target: 'http://localhost:8080/',
          changeOrigin: true,
        },
      },
    },
    // 路径重定向
    resolve: {
      alias: [
        {
          find: /\/#\//,
          replacement: pathResolve('types'),
        },
        {
          find: '@',
          replacement: pathResolve('src'),
        },
      ],
      dedupe: ['vue'],
    },
    plugins: [
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
        symbolId: 'icon-[dir]-[name]',
        svgoOptions: false,
      }),
      vue(),
      // 压缩
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),

      mpaPlugin({
        historyApiFallback: {
          rewrites: [{ from: /\/engine/, to: '/engine.html' }],
        },
      }),
    ],
    build: {
      target: 'es2015',
      outDir: 'dist',
      rollupOptions: {
        input: {
          index: resolve(__dirname, './index.html'),
          engine: resolve(__dirname, './engine.html'),
        },
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: (chunkInfo: any) => {
            if (
              ['.png', '.jpg', '.jpeg'].includes(path.extname(chunkInfo.name))
            ) {
              return `static/[ext]/[name].[ext]`;
            }
            return `static/[ext]/[name]-[hash].[ext]`;
          },
        },
      },

      // 禁用 brotliSize 压缩大小报告
      brotliSize: false,
      // chunk 警告大小
      chunkSizeWarningLimit: 2000,
      // minify: 'terser', // 如果需要用terser混淆，可打开这两行
      // terserOptions: {
      //   compress: {
      //     keep_infinity: true,
      //     drop_console: true,
      //     drop_debugger: true,
      //   },
      // },
    },
  };
});
