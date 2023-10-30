export class TabManager {
  constructor() {
    this.tabs = {};
  }

  addTab(tab) {
    this.tabs[tab.id] = tab;
  }

  removeTab(tab) {
    delete this.tabs[tab.id];
  }
}
