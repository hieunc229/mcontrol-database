"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Collection_1 = __importDefault(require("./Collection"));
var CollectionAbstraction = /** @class */ (function () {
    function CollectionAbstraction(props) {
        this._c = new Collection_1.default(props);
    }
    CollectionAbstraction.prototype.onObjectWillInsert = function (object) {
        return object;
    };
    CollectionAbstraction.prototype.onObjectWillUpdate = function (id, object) {
        return object;
    };
    CollectionAbstraction.prototype.onObjectWillRemove = function (id) {
        return id;
    };
    CollectionAbstraction.prototype.onObjectWillSet = function (id, object) {
        return object;
    };
    CollectionAbstraction.prototype.insert = function (object) {
        var data = this.onObjectWillInsert ? this.onObjectWillInsert(object) : object;
        return this._c.insert(data);
    };
    CollectionAbstraction.prototype.set = function (id, object) {
        var data = this.onObjectWillSet ? this.onObjectWillSet(id, object) : object;
        return this._c.set(id, data);
    };
    CollectionAbstraction.prototype.update = function (id, changes) {
        var data = this.onObjectWillUpdate ? this.onObjectWillUpdate(id, changes) : changes;
        return this._c.update(id, data);
    };
    CollectionAbstraction.prototype.remove = function (id) {
        var data = this.onObjectWillRemove ? this.onObjectWillRemove(id) : id;
        return this._c.remove(data);
    };
    CollectionAbstraction.prototype.get = function (id) {
        return this._c.get(id);
    };
    CollectionAbstraction.prototype.c = function () {
        return this._c;
    };
    return CollectionAbstraction;
}());
exports.default = CollectionAbstraction;
