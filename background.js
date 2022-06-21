function fill(info, tab) {
  chrome.tabs.executeScript(null, { file: "jquery-3.1.1.min.js" }, function () {
    chrome.tabs.executeScript(null, { file: "faker.js" }, function () {
      chrome.tabs.executeScript(null, { file: "run.js" }, function () {});
    });
  });
}


chrome.browserAction.onClicked.addListener(
  function (tab) {
    currentSetupKey = null;
    // chrome.tabs.sendMessage(tab.id,{"message":"hide"});
    fill(null, tab)
  }
);