
function getTableRuleHeader() {
    let thead = $('<thead/>')
    let tr = $('<tr/>')
    tr.append($('<th/>').html('Input selector'))
    tr.append($('<th/>').html('Value type'))
    tr.append($('<th/>').html('Args'))
    tr.append($('<th/>').html('Action'))
    thead.append(tr)
    return thead
}

function getTableRuleRow(inputSelector, valueType, args, action) {
    let tr = $('<tr/>')
    tr.append($('<td/>').html(inputSelector))
    tr.append($('<td/>').html(valueType))
    tr.append($('<td/>').html(args))
    tr.append($('<td/>').append(action))
    return tr
}

function drawTableRule(pageRules, pageUrl) {
    let container = $('#pageRuleContainer')
    container.append($('<h6/>').html('Page url: ' + pageUrl))
    let table = $('<table/>', {
        class: 'table table-bordered'
    })
    let thead = getTableRuleHeader()
    table.append(thead)

    let tbody = $('<tbody/>')
    let inputRules = pageRules[pageUrl]
    for (const [inputSelector, value] of Object.entries(inputRules)) {
        let deleteBtn = $('<button/>', {
            class: 'btn btn-danger btn-sm',
            on: {
                click: function () {
                    delete pageRules[pageUrl][inputSelector]
                    if ($.isEmptyObject(pageRules[pageUrl])) {
                        delete pageRules[pageUrl]
                    }
                    chrome.storage.sync.set({
                        pageRules: pageRules
                    }, function () {
                        drawAllTableRule(pageRules)
                    });
                }
            }
        }).html('Delete')

        let tr = getTableRuleRow(inputSelector, value['valueType'], value['args'], deleteBtn)
        tbody.append(tr)
    }
    table.append(tbody)
    container.append(table)

    let deletePageRuleBtn = $('<button/>', {
        class: 'btn btn-danger btn-sm',
        on: {
            click: function () {
                delete pageRules[pageUrl]
                chrome.storage.sync.set({
                    pageRules: pageRules
                }, function () {
                    drawAllTableRule(pageRules)
                });
            }
        }
    }).html('Delete page rules')
    container.append(deletePageRuleBtn)
    container.append($('<hr/>'))
}


function drawAllTableRule(pageRules) {
    let container = $('#pageRuleContainer')
    container.html('')

    for (const [pageUrl, rules] of Object.entries(pageRules)) {
        drawTableRule(pageRules, pageUrl)
    }

}

function savePageRule() {
    var pageUrl = document.getElementById('pageUrl').value.trim();
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
            drawAllTableRule(pageRules)
        });

    });
}

function clearAllRules() {
    chrome.storage.sync.set({
        pageRules: {}
    }, function () {
        drawAllTableRule(pageRules)
    });
}

document.getElementById('save').addEventListener('click', savePageRule);
// document.getElementById('clearAll').addEventListener('click', clearAllRules);
$("#valueType").change(function () {
    $("#fnFakerjs-wrapper").hide()
    if ($(this).val() == 'rangeNumber') {
        $("#args").attr('placeholder', 'min,max')
    }
    else if ($(this).val() == 'enum') {
        $("#args").attr('placeholder', 'Value A,Value B,Value C')
    }
    else if ($(this).val() == 'fakerjsFunction') {
        $("#args").attr('placeholder', 'phone.phoneNumber')
        $("#fnFakerjs-wrapper").show()
    } else {
        $("#args").attr('placeholder', '')
    }
});

$("#fnFakerjs").change(function () {
    $("#args").val($(this).val())
});


chrome.storage.sync.get({
    pageRules: {}
}, function (items) {
    let pageRules = items.pageRules
    drawAllTableRule(pageRules)
})

let urlSearch = new URLSearchParams(window.location.search)
document.getElementById('pageUrl').value = urlSearch.get('pageUrl')

var isImportAction = false

function setImportAction(flag) {
    isImportAction = flag
    if (flag) {
        $("#btn-close-box").html('Import')
    } else {
        $("#btn-close-box").html('Close')
    }
}

$("#export").click(function () {
    setImportAction(false)
    chrome.storage.sync.get({
        pageRules: {}
    }, function (items) {
        let pageRules = items.pageRules

        let pageRuleJson = JSON.stringify(pageRules)
        $('#export-box').show()
        $('#export-data').val(pageRuleJson)
    });
});

$("#import").click(function () {
    $('#export-box').show()
    $('#export-data').val('')
    setImportAction(true)

})


$("#btn-close-box").click(function () {
    if (isImportAction) {
        let pageRuleJson = $('#export-data').val()
        if (pageRuleJson.trim()) {
            let pageRulesImport = JSON.parse(pageRuleJson)

            chrome.storage.sync.get({
                pageRules: {}
            }, function (items) {
                let pageRules = items.pageRules
                for (const [key, value] of Object.entries(pageRulesImport)) {
                    pageRules[key] = value
                }
                
                chrome.storage.sync.set({
                    pageRules: pageRules
                }, function () {
                    drawAllTableRule(pageRules)
                });

            });
        }
        
    }


    $('#export-box').hide()
    $('#export-data').val('')
    setImportAction(false)
});

