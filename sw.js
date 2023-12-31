import {TabManager} from "./tab-manager.js";
import {TabInternal} from "./tab-internal.js";


const tabManager = new TabManager();


chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF'
  });
});


chrome.action.onClicked.addListener(async (tab) => {
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';

    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState
    });

    let tabInternal;

    if (nextState === 'ON') {
      tabInternal = new TabInternal(tab);
      tabManager.addTab(tabInternal);
      await tabInternal.initialize();
    } else if (nextState === 'OFF') {
      tabManager.removeTab(tab)
    }
  }
);
