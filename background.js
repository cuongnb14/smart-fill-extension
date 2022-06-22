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