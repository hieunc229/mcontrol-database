"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var IndexChain = /** @class */ (function () {
    function IndexChain(props) {
        this._batch = props.batch;
        this._property = props.property;
        this.put = this.put.bind(this);
    }
    IndexChain.prototype.put = function (id, object) {
        this.appendProp({
            batch: this._batch,
            property: this._property,
            id: id, parentProp: "", object: object
        });
    };
    IndexChain.prototype.del = function (id, removes) {
        var _this = this;
        Object.keys(removes).forEach(function (prop) {
            var value = removes[prop];
            switch (typeof removes[prop]) {
                case "boolean":
                    _this._batch.del((value ? '1' : '0') + ":" + id);
                    break;
                case "string":
                    _this._batch.del(value.toLowerCase() + ":" + id);
                    break;
                case "number":
                    _this._batch.del(value + ":" + id);
                    break;
            }
        });
    };
    IndexChain.prototype.commit = function () {
        return this._batch.write();
    };
    IndexChain.prototype.appendProp = function (opts) {
        var _this = this;
        var value = opts.object[opts.property];
        var id = opts.id;
        switch (typeof value) {
            case "boolean":
                opts.batch.put("" + opts.parentProp + (value ? '1' : '0') + ":" + id, true);
                break;
            case "string":
                opts.batch.put("" + opts.parentProp + value.toLowerCase() + ":" + id, true);
                break;
            case "number":
                opts.batch.put("" + opts.parentProp + utils_1.to16Chars(value) + ":" + id, true);
                break;
            case "object":
                if (Array.isArray(value)) {
                    value.forEach(function (arrayValue) {
                        opts.batch.put(opts.parentProp + "a:" + arrayValue + ":" + id, true);
                    });
                }
                else {
                    Object.keys(value).forEach(function (prop) {
                        _this.appendProp({
                            parentProp: opts.parentProp + opts.property + ':',
                            property: opts.property,
                            object: value[prop],
                            id: id,
                            batch: opts.batch
                        });
                    });
                }
                break;
        }
    };
    return IndexChain;
}());
exports.IndexChain = IndexChain;
