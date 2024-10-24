function fillAllInjectedFunction() {
  chrome.storage.sync.get(['pageRules'], function(items) {
    let filler = null
    let tabUrl = window.location.href.split('?')[0]
    let match = false
    if (items.pageRules) {
      Object.keys(items.pageRules).forEach(pageUrl => {
        if (!match) {
          if (pageUrl.startsWith('^')) {
            if(tabUrl.startsWith(pageUrl.slice(1,))){
              match = true
              filler = new SmartFiller(items.pageRules[pageUrl])
            }
          } else {
            if (pageUrl == tabUrl) {
              match = true
              filler = new SmartFiller(items.pageRules[pageUrl])
            }
          }
        }
      });
    }
    

    
    if (!filler) {
      filler = new SmartFiller()
    }

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

