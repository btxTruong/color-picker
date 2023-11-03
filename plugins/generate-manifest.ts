import { PluginOption } from 'vite';
import * as path from 'path';
import * as fs from 'fs';

const distDir = path.resolve(__dirname, '..', 'dist');

function generateManifestHelper(manifest: chrome.runtime.ManifestV3) {
	if (!fs.existsSync(distDir)) {
		fs.mkdirSync(distDir);
	}
	const targetFile = path.resolve(distDir, 'manifest.json');
	fs.writeFileSync(targetFile, JSON.stringify(manifest, null, 2));
}

export default function generateManifest(manifest: chrome.runtime.ManifestV3): PluginOption {
	return {
		name: 'generate-manifest',
		buildStart() {
			generateManifestHelper(manifest);
		},
		buildEnd() {
			generateManifestHelper(manifest);
		},
	};
}
