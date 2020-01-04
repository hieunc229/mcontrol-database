"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MetaStore_1 = __importDefault(require("../internal/MetaStore"));
var IndexValue_1 = __importDefault(require("./IndexValue"));
var IndexFulltext_1 = __importDefault(require("./IndexFulltext"));
var ManagerChain_1 = require("./ManagerChain");
var IndexManager = /** @class */ (function () {
    function IndexManager(props) {
        this._indexes = [];
        this._path = props.path;
        this._metaPath = this._path + '/_indexes';
        this.updateMeta = this.updateMeta.bind(this);
        this.getStore = this.getStore.bind(this);
        this.startup.bind(this)({ indexes: props.indexes });
    }
    IndexManager.prototype.insert = function (id, object) {
        return Promise.all(this._indexes.map(function (item) {
            return item.put(id, object);
        }));
    };
    IndexManager.prototype.update = function (id, object, removes) {
        var _this = this;
        return Promise.all(Object.keys(removes).map(function (prop) {
            var index = _this._indexes.find(function (item) { return item._prop == prop; });
            return index ? index.del(id, removes) : null;
        })
            .concat(Object.keys(object).map(function (prop) {
            var index = _this._indexes.find(function (item) { return item._prop == prop; });
            return index ? index.put(id, removes) : null;
        })));
    };
    IndexManager.prototype.batch = function () {
        return new ManagerChain_1.ManagerChain({ indexes: this._indexes });
    };
    IndexManager.prototype.createIndex = function (property, type) {
        if (!this._indexes.find(function (i) { return i._prop === property; })) {
            var opts = { path: this._path, property: property };
            var index = type !== "fulltext" ?
                new IndexValue_1.default(opts) :
                new IndexFulltext_1.default(opts);
            this._indexes.push(index);
            this.updateMeta();
            return index;
        }
        return undefined;
    };
    IndexManager.prototype.removeIndex = function (property) {
        return __awaiter(this, void 0, void 0, function () {
            var index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        index = this._indexes.findIndex(function (item) { return item._prop === property; });
                        if (!index) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._indexes[index].destroy()];
                    case 1:
                        _a.sent();
                        this._indexes.splice(index, 1);
                        return [2 /*return*/, true];
                    case 2: return [2 /*return*/, false];
                }
            });
        });
    };
    IndexManager.prototype.destroy = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.all(this._indexes.map(function (item) { return item.destroy(); }))];
            });
        });
    };
    IndexManager.prototype.getStore = function (property, type) {
        var index = this._indexes.find(function (s) { return s._prop === property; });
        if (!index) {
            var opts = { path: this._path, property: property };
            index = type !== "fulltext" ?
                new IndexValue_1.default(opts) :
                new IndexFulltext_1.default(opts);
            this._indexes.push(index);
        }
        return index;
    };
    IndexManager.prototype.updateMeta = function () {
        return __awaiter(this, void 0, void 0, function () {
            var meta;
            return __generator(this, function (_a) {
                meta = {
                    indexes: this._indexes.map(function (item) { return item.getMeta(); })
                };
                return [2 /*return*/, MetaStore_1.default.save(this._metaPath, meta)];
            });
        });
    };
    IndexManager.prototype.startup = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            var meta;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (opts.indexes && opts.indexes.length) {
                            this._indexes = opts.indexes.map(function (id) {
                                var props = { path: _this._path, property: id.property };
                                return id.type !== "fulltext" ? new IndexValue_1.default(props) : new IndexFulltext_1.default(props);
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, MetaStore_1.default.load(this._metaPath)];
                    case 1:
                        meta = _a.sent();
                        if (meta && meta.indexes) {
                            this._indexes = meta.indexes.map(function (item) {
                                var props = { path: _this._path, property: item.property };
                                return item.type !== "fulltext" ? new IndexValue_1.default(props) : new IndexFulltext_1.default(props);
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return IndexManager;
}());
exports.default = IndexManager;
