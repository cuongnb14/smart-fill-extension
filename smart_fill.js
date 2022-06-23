/**
 * 
 * Utils funtions
 */

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomInArray(arr) {
    return arr[Math.floor((Math.random()*arr.length))];
}


const ValueGenerator = {
    "_fixed": function(args) {
        return args
    },
    "_rangeNumber": function(args) {
        let range = args.split(',')
        return randomInt(parseInt(range[0]), parseInt(range[1]))
    },
    "_enum": function(args) {
        let range = args.split(',')
        return randomInArray(range)
    },
    "color": function () {
        return '#' + pad(Math.floor(Math.random() * 16777215).toString(16), 6);
    },
    "title": function () {
        return faker.lorem.sentence()
    },
    "date": function () {
        var rndDate = randomDate(new Date(1977, 8, 1), new Date(2999, 8, 1));
        var result = [
            rndDate.getFullYear(),
            "-",
            pad(rndDate.getMonth() + 1, 2),
            "-",
            pad(rndDate.getDay() + 1, 2),
        ].join('');
        return result;
    },
    "email": function () {
        return faker.internet.email().toLowerCase()
    },
    "name": function () {
        return faker.name.findName()
    },
    "month": function () {
        var rndDate = randomDate(new Date(1977, 8, 1), new Date(2999, 8, 1));
        var result = [
            rndDate.getFullYear(),
            "-",
            pad(rndDate.getMonth() + 1, 2)
        ].join('');
        return result;
    },
    "number": function () {
        return faker.random.number()
    },
    "range": function (el) {
        var minValue = parseInt($(el).prop('min'), 10);
        var maxValue = parseInt($(el).prop('max'), 10);
        return randomInt(minValue, maxValue);
    },
    "tel": function () {
        return faker.phone.phoneNumber()
    },
    "url": function () {
        return faker.internet.url()
    },
    "week": function () {
        var rndDate = randomDate(new Date(1977, 8, 1), new Date(2999, 8, 1));
        var onejan = new Date(rndDate.getFullYear(), 0, 1);
        var weeknumber = Math.ceil((((rndDate - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        var result = rndDate.getFullYear() + "-W" + pad(weeknumber, 2);
        return result;
    },
    "radio": function (el) {
        var groupName = $(el).attr("name");
        var radios = $("input:radio:enabled[name='" + groupName + "']");
        var idx = randomInt(0, radios.length - 1);
        $(radios[idx]).prop("checked", true);
    },
    "checkbox": function (el) {
        var randomBoolean = Math.random() >= 0.5;
        $(el).attr("checked", randomBoolean);
    }
}

class SmartFiller {
    constructor(inputRules) {
        this.inputRules = []
        if (inputRules) {
            for (const [inputSelector, rule] of Object.entries(inputRules)) {
                let el = null
                if (inputSelector.startsWith('.') || inputSelector.startsWith('#')) {
                    el = $(inputSelector)
                } else {
                    el = $(`input[name=${inputSelector}]`)
                }
                let inputRule = {
                    el: el,
                    rule: rule
                }
                this.inputRules.push(inputRule)
            }
        }
        
    }

    getNodeName(el) {
        return $(el)[0].nodeName.toLowerCase()
    }

    getInputValueType(el) {
        var inputName = $(el).attr('name').toLowerCase();

        if (inputName.includes('name')) {
            return 'name'
        }

        if (inputName.includes('email')) {
            return 'email'
        }

        if (inputName.includes('phone')) {
            return 'tel'
        }

        if (inputName.includes('link') || inputName.includes('url')) {
            return 'url'
        }

        if (inputName.includes('title')) {
            return 'title'
        }

        return $(el).attr('type')
    }

    _fillInput(el) {
        let value = ''
        let valueType = this.getInputValueType(el)
        if (valueType == "file") {
            return
        }
        let valueFn = ValueGenerator[valueType]
        if (valueFn) {
            value = valueFn(el)
        } else {
            value = faker.lorem.word()
        }
        $(el).trigger('focus').val(value);
        $(el)[0].dispatchEvent(new Event('input', { bubbles: true }));
    }

    _fillSelectBox(el) {
        var opts = $(el)[0].options;
        var idx = randomInt(0, opts.length - 1);
        var val = opts[idx].value;
        $(el).trigger('focus').val(val);
        $(el)[0].dispatchEvent(new Event('input', { bubbles: true }));
    }

    _fillTextarea(el) {
        $(el).trigger('focus').val(faker.lorem.paragraphs());
        $(el)[0].dispatchEvent(new Event('input', { bubbles: true }));
    }

    getInputRule(el) {
        let result = null
        this.inputRules.forEach((rule) => {
            if ($(el).is(rule.el)) {
                result = rule.rule
            }
        });
        return result
    }

    fill(el) {
        let rule = this.getInputRule(el)
        if (rule && rule.valueType == 'ignore') {
            return
        }

        if (rule) {
            let value = ValueGenerator['_'+rule.valueType](rule.args)
            $(el).trigger('focus').val(value);
            $(el)[0].dispatchEvent(new Event('input', { bubbles: true }))
            return
        }
        let nodeName = this.getNodeName(el)
        switch (nodeName) {
            case 'input':
                this._fillInput(el)
                break

            case "select":
                this._fillSelectBox(el)
                break

            case "textarea":
                this._fillTextarea(el)
                break

        }

    }

    fillAll() {
        let context = this
        $("input:enabled, select:enabled, textarea:enabled").not(':button,:hidden,input[type=submit],input[readonly]').each(function () {
            context.fill(this);
        });
    }
}