function fillAllInjectedFunction() {
  let filler = new SmartFiller()
  filler.fillAll()
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