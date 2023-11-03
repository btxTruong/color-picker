import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

import generateManifest from './plugins/generate-manifest.ts';
import manifest from './manifest.ts';

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');
const serviceWorkerDir = resolve(srcDir, 'service-worker');
const contentScriptDir = resolve(srcDir, 'content-script');
const outDir = resolve(rootDir, 'dist');

const isDev = process.env.__DEV__ === 'true';
const isProd = !isDev;

export default defineConfig({
	plugins: [tsconfigPaths(), generateManifest(manifest)],
	build: {
		outDir,
		minify: isProd,
		reportCompressedSize: isProd,
		modulePreload: false,
		rollupOptions: {
			input: {
				'service-worker': resolve(serviceWorkerDir, 'index.ts'),
				'content-script': resolve(contentScriptDir, 'index.ts'),
			},
			output: {
				// https://stackoverflow.com/questions/71180561/vite-change-ouput-directory-of-assets
				entryFileNames: 'src/[name]/index.js',
				chunkFileNames: 'assets/js/[name].[hash].js', // vendor chunk filenames
				assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
			},
		},
	},
});
