var injected = true;

function injectedFunction() {
  let filler = new SmartFiller()
  filler.fillAll()
}

function fill(tab) {
  if(injected) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: injectedFunction
      }
    )

  } else {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: [
          "libs/jquery-3.6.0.min.js",
          "libs/faker-3.1.0.js", 
          "auto_fill.js"
        ]
      }
    )
    injected = true;
  }
  
}


chrome.action.onClicked.addListener(
  function (tab) {
    fill(tab)
  }
);