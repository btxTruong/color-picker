export class TabInternal {
  #tab;

  constructor(tab) {
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
    const self = this;

    await chrome.scripting.executeScript({
      files: ['content-script.browser.js'],
      target: {tabId: self.#tab.id}
    })
  }

  takeScreenshot() {
    const self = this;

    chrome.tabs.captureVisibleTab(this.#tab.id, {format: 'png'}, async (dataUrl) => {
      await self.sendMessage({
        type: 'screenCaptureUrl',
        tabWidth: self.#tab.width,
        tabHeight: self.#tab.height,
        dataUrl
      });
    })
  }

  async sendMessage(message) {
    await chrome.tabs.sendMessage(this.#tab.id, message);
  }

  onMessageRegister() {
    const self = this;

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === 'screenCapture') {
        self.takeScreenshot();
      }
    });
  }
}
