"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ManagerChain = /** @class */ (function () {
    function ManagerChain(props) {
        this.batchIndexes = props.indexes.map(function (item) { return item.batch(); });
    }
    ManagerChain.prototype.put = function (id, object) {
        this.batchIndexes.forEach(function (item) { return item.put(id, object); });
    };
    ManagerChain.prototype.remove = function (id) {
    };
    ManagerChain.prototype.commit = function () {
        return Promise.all(this.batchIndexes.map(function (item) { return item.commit(); }));
    };
    return ManagerChain;
}());
exports.ManagerChain = ManagerChain;
