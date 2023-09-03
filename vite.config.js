import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import { configDefaults } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
    // envDir: './',
    envDir: fileURLToPath(new URL('./', import.meta.url)),
    plugins: [
        vue(),
        // vue({
        //     script: {
        //         defineModel: true
        //     }
        // }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
            // '@': resolve(__dirname, 'src')
        }
    },
    // build: {
    //     manifest: true,
    //     rollupOptions: {
    //         input: fileURLToPath(new URL('./src/main.js', import.meta.url))
    //     }
    // },
    optimizeDeps: {
        include: [
            '@notoursllc/figleaf',
            'date-fns',
            'date-fns-tz',
            'youtube-player'
        ]
    },
    test: {
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, 'e2e/*'],
        root: fileURLToPath(new URL('./', import.meta.url)),
        transformMode: {
            web: [/\.[jt]sx$/]
        }
    }
});
