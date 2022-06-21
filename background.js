function fill(info, tab) {
  chrome.scripting.executeScript({target: {tabId: tab.id}, files: ["libs/jquery-3.6.0.min.js", "libs/faker-3.1.0.js", "auto_fill.js"] }, () => {

  })
}


chrome.action.onClicked.addListener(
  function (tab) {
    fill(null, tab)
  }
);