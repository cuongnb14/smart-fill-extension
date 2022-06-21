function drawPageRulesTable(pageRules) {
    let tbody = $('#pageRuleTable tbody')
    tbody.html('')
    

    for (const [pageUrl, rules] of Object.entries(pageRules)) {
        for (const [inputSelector, value] of Object.entries(rules)) {
            let tr = $('<tr/>')
            tr.append($('<th/>').html(pageUrl))
            tr.append($('<td/>').html(inputSelector))
            tr.append($('<td/>').html(value['valueType']))
            tr.append($('<td/>').html(value['args']))
            
            tbody.append(tr)
        }

    }

}

function savePageRule() {
    var pageUrl = document.getElementById('pageUrl').value;
    var inputSelector = document.getElementById('inputSelector').value;
    var valueType = document.getElementById('valueType').value;
    var args = document.getElementById('args').value;


    chrome.storage.sync.get({
        pageRules: {}
    }, function (items) {
        let pageRules = items.pageRules

        if (!(pageUrl in pageRules)) {
            pageRules[pageUrl] = {}
        } 
        pageRules[pageUrl][inputSelector] = {
            valueType,
            args
        }

        chrome.storage.sync.set({
            pageRules: pageRules
        }, function () {
            document.getElementById('pageRules').textContent = JSON.stringify(pageRules, null, 2)
            drawPageRulesTable(pageRules)
        });

    });
}

function clearAllRules() {
    chrome.storage.sync.set({
        pageRules: {}
    }, function () {
        document.getElementById('pageRules').textContent = JSON.stringify(pageRules, null, 2)
        drawPageRulesTable(pageRules)
    });
}

document.getElementById('save').addEventListener('click', savePageRule);
document.getElementById('clearAll').addEventListener('click', clearAllRules);

drawPageRulesTable()