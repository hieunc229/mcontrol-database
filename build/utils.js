"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function to16Chars(number) {
    var str = "000000000000000" + number;
    return str.substr(str.length - 16, 16);
}
exports.to16Chars = to16Chars;
function deepMerge(target, source) {
    // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            if (source[key] instanceof Object)
                Object.assign(source[key] || {}, deepMerge(target[key] || {}, source[key]));
        }
    }
    // Join `target` and modified `source`
    return Object.assign(target || {}, source);
}
exports.deepMerge = deepMerge;
