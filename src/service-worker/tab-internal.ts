import { MessageType } from '@src/types.ts';

export class TabInternal {
	#tab: chrome.tabs.Tab;

	constructor(tab: chrome.tabs.Tab) {
		this.#tab = tab;
	}

	get id() {
		return this.#tab?.id;
	}

	async initialize() {
		this.onMessageRegister();

		await this.injectScript();
	}

	async injectScript() {
		await chrome.scripting.executeScript({
			files: ['../content-script/index.js'],
			target: { tabId: this.#tab.id! },
		});
	}

	takeScreenshot() {
		chrome.tabs.captureVisibleTab(this.#tab.windowId, { format: 'png' }, async (dataUrl) => {
			await this.sendMessage({
				type: MessageType.ScreenShotResponse,
				tabWidth: this.#tab.width,
				tabHeight: this.#tab.height,
				dataUrl,
			});
		});
	}

	async sendMessage(message: Record<string, unknown>) {
		await chrome.tabs.sendMessage(this.#tab.id!, message);
	}

	onMessageRegister() {
		chrome.runtime.onMessage.addListener((request) => {
			if (request.type === MessageType.ScreenShot) {
				this.takeScreenshot();
			}
		});
	}
}
