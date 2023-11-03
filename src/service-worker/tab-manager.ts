import { TabInternal } from '@src/service-worker/tab-internal.ts';

export class TabManager {
	#tabs: Record<number, TabInternal>;

	constructor() {
		this.#tabs = {};
	}

	addTab(tab: TabInternal) {
		this.#tabs[tab.id!] = tab;
	}

	removeTab(tabId: number) {
		delete this.#tabs[tabId];
	}
}
