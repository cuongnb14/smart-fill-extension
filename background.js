function fill(info, tab) {
  chrome.scripting.executeScript({target: {tabId: tab.id}, files: ["jquery-3.1.1.min.js", "faker.js", "run.js"] }, () => {

  })
}


chrome.action.onClicked.addListener(
  function (tab) {
    fill(null, tab)
  }
);