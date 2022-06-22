function fillAllInjectedFunction() {
  chrome.storage.sync.get(['pageRules'], function(items) {
    let tabUrl = window.location.href.split('?')[0]
    let pageRule = items.pageRules[tabUrl]

    let filler = new SmartFiller(pageRule)
    filler.fillAll()
  });

  
}

function fill(tab) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: fillAllInjectedFunction
      }
    )
}


chrome.action.onClicked.addListener(
  function (tab) {
    fill(tab)
  }
);

chrome.contextMenus.create({
  id: "addPageRule",
  title: "Smart Fill - Add page rules",
  contexts: ["all"]
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "addPageRule") {
    console.log(tab.url);

    var optionsUrl = chrome.runtime.getURL('options.html');
    optionsUrl = optionsUrl + '?pageUrl=' + tab.url
    chrome.tabs.create({ 'url': optionsUrl });
  }
});

