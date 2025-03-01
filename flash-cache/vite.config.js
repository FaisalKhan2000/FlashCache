import { defineConfig } from 'vite';

export default defineConfig({
build: {
    lib: {
    entry: './src/index.js',
    name: 'FlashCache',
    formats: ['es', 'umd']
    }
},
test: {
    globals: true,
    environment: 'node',
},
});
