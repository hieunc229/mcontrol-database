"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var shortid_1 = __importDefault(require("shortid"));
var indexer_1 = __importDefault(require("./indexer"));
var fs = __importStar(require("fs"));
var QueryObject_1 = require("./QueryObject");
var createStore_1 = require("./internal/createStore");
var recursiveRemoveDir_1 = require("./internal/recursiveRemoveDir");
var iteratorStream = require('level-iterator-stream');
var Collection = /** @class */ (function () {
    function Collection(props) {
        var _this = this;
        this.data = function () {
            return _this.q().get({ values: true });
        };
        this._path = props.location;
        this.createIndex = this.createIndex.bind(this);
        this.insert = this.insert.bind(this);
        this.getMeta = this.getMeta.bind(this);
        if (!fs.existsSync(props.location)) {
            fs.mkdirSync(props.location);
        }
        this._dbInstance = createStore_1.createStore(props.location + '/store');
        this._indexManager = new indexer_1.default({
            path: props.location,
            indexes: props.indexes && props.indexes.map(function (id) {
                if (typeof id === "string")
                    return { property: id, type: 'regular' };
                return id;
            })
        });
    }
    Collection.prototype.close = function () {
        return this._dbInstance.close();
    };
    Collection.prototype.open = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = !this._dbInstance.isOpen();
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._dbInstance.open()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2: return [2 /*return*/, _a];
                }
            });
        });
    };
    Collection.prototype.get = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = !this._dbInstance.isOpen();
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._dbInstance.open()];
                    case 1:
                        _a = (_c.sent());
                        _c.label = 2;
                    case 2:
                        _a;
                        _b = !this._dbInstance.isOpen();
                        if (!_b) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._dbInstance.open()];
                    case 3:
                        _b = (_c.sent());
                        _c.label = 4;
                    case 4:
                        _b;
                        this._dbInstance.get(id, { asBuffer: false }, function (err, value) {
                            err ? reject(err) : resolve(__assign({ id: id }, JSON.parse(value)));
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Collection.prototype.getByKeys = function (keys) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            function seekNext(index) {
                i = index;
                if (keys[index] === undefined) {
                    resolve(docs);
                }
                itr.seek(keys[index]);
            }
            var _a, docs, itr, stream, i;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = !this._dbInstance.isOpen();
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._dbInstance.open()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        _a;
                        keys = keys.sort(function (a, b) { return b.localeCompare(a); });
                        docs = [];
                        itr = this._dbInstance.iterator();
                        stream = iteratorStream(itr), i = 0;
                        stream.on("data", function (data) {
                            docs.push(__assign({ id: data.key.toString() }, JSON.parse(data.value.toString())));
                            seekNext(i + 1);
                        });
                        seekNext(0);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Collection.prototype.insert = function (object) {
        var _this = this;
        var _ = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var id, value, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = object.id, value = __rest(object, ["id"]);
                        if (!id)
                            id = shortid_1.default.generate();
                        _a = !this._dbInstance.isOpen();
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._dbInstance.open()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        _a;
                        this._dbInstance.put(id, JSON.stringify(value), function (err) {
                            console.log(err);
                            err ? reject(err)
                                : _this._indexManager.insert(id, value)
                                    .then(function () { return resolve(id); }).catch(reject);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    // Update/merge a record, throw error if id not found
    Collection.prototype.update = function (id, changes) {
        return __awaiter(this, void 0, void 0, function () {
            var doc, removes, inserts;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get(id)];
                    case 1:
                        doc = _a.sent();
                        delete doc.id;
                        removes = {}, inserts = changes;
                        Object.keys(changes).forEach(function (prop) {
                            if (prop in doc) {
                                removes[prop] = doc[prop];
                            }
                        });
                        changes = Object.assign({}, doc, changes);
                        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                var _a;
                                var _this = this;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _a = !this._dbInstance.isOpen();
                                            if (!_a) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this._dbInstance.open()];
                                        case 1:
                                            _a = (_b.sent());
                                            _b.label = 2;
                                        case 2:
                                            _a;
                                            this._dbInstance.put(id, JSON.stringify(changes), function (err) {
                                                if (err) {
                                                    reject(err);
                                                }
                                                else {
                                                    _this._indexManager.update(id, inserts, removes)
                                                        .then(resolve).catch(reject);
                                                }
                                            });
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                }
            });
        });
    };
    // Insert a record, override if exists
    Collection.prototype.set = function (id, changes) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = !this._dbInstance.isOpen();
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._dbInstance.open()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        _a;
                        this._dbInstance.put(id, JSON.stringify(changes), function (err) {
                            err ? reject(err)
                                : _this._indexManager.insert(id, changes)
                                    .then(resolve).catch(reject);
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Collection.prototype.remove = function (id) {
        return this._dbInstance.del(id);
    };
    Collection.prototype.batch = function (opts) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var batch = _this._dbInstance.batch();
            var batchIndexes = _this._indexManager.batch();
            opts.inserts && opts.inserts.forEach(function (doc) {
                var id = doc.id, rest = __rest(doc, ["id"]);
                !id && (id = shortid_1.default.generate());
                batch.put(id, JSON.stringify(rest));
                batchIndexes.put(id, rest);
            });
            opts.updates && opts.updates.forEach(function (doc) {
                var id = doc.id, rest = __rest(doc, ["id"]);
                batch.put(id, JSON.stringify(rest));
                batchIndexes.put(id, rest);
            });
            opts.deletes && opts.deletes.forEach(function (doc) {
                batch.del(doc.id);
            });
            Promise.all([batch.write(), batchIndexes.commit()])
                .then(resolve)
                .catch(reject);
        });
    };
    Collection.prototype.q = function (property) {
        return new QueryObject_1.QueryObject(!property || property === "id" ? this._dbInstance
            : this._indexManager.getStore(property)._store);
    };
    // Index section 
    Collection.prototype.createIndex = function (def) {
        return this._indexManager.createIndex(def.property, def.type);
    };
    Collection.prototype.removeIndex = function (property) {
        return this._indexManager.removeIndex(property);
    };
    Collection.prototype.getMeta = function () {
        var meta = {};
        return meta;
    };
    Collection.prototype.getIndexes = function () {
        return this._indexManager._indexes.map(function (i) { return i.getMeta(); });
    };
    Collection.prototype.destroyCollection = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, recursiveRemoveDir_1.deleteDirRecursive(this._path)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._indexManager.destroy()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Collection;
}());
exports.default = Collection;
