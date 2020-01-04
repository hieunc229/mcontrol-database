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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var Auth_1 = __importDefault(require("./Auth"));
var MetaStore_1 = __importDefault(require("./internal/MetaStore"));
var Collection_1 = __importDefault(require("./Collection"));
var FilebaseToken_1 = require("./token/FilebaseToken");
var Database = /** @class */ (function () {
    function Database(opts) {
        this._meta = {};
        this._stores = {};
        this.saveMeta = this._saveMeta;
        if (!fs.existsSync(opts.location)) {
            fs.mkdirSync(opts.location);
        }
        this._location = opts.location;
        this._metaPath = opts.location + '/_meta';
        this._token = new FilebaseToken_1.Filebase_TokenManager({ path: opts.location });
        this.createCollection = this.createCollection.bind(this);
        this.saveMeta = this.saveMeta.bind(this);
        this.getMeta = this.getMeta.bind(this);
        this.startup.bind(this)();
    }
    Database.prototype.auth = function () {
        if (!this._auth) {
            this._auth = new Auth_1.default(__assign({ location: this._location + '/_auth' }, this._meta.auth));
        }
        return this._auth;
    };
    Database.prototype.token = function () {
        return this._token;
    };
    Database.prototype.collection = function (name, opts) {
        if (name in this._stores === false) {
            this._stores[name] = this.createCollection(name, opts);
        }
        return this._stores[name];
    };
    Database.prototype.removeCollection = function (name) {
        this._stores[name].destroyCollection();
        delete this._stores[name];
    };
    Database.prototype.getMeta = function () {
        var _this = this;
        var collections = [], meta;
        Object.keys(this._stores).forEach(function (store) {
            meta = _this._stores[store].getMeta();
            meta.name = store;
            meta.indexes = _this._stores[store].getIndexes();
            collections.push(meta);
        });
        return {
            collections: collections,
            auth: this._auth ? this._auth.getMeta() : {}
        };
    };
    Database.prototype._saveMeta = function () {
        var meta = this.getMeta();
        return MetaStore_1.default.save(this._metaPath, meta);
    };
    Database.prototype.createCollection = function (name, opts) {
        if (name in this._stores === false) {
            this._stores[name] = new Collection_1.default(__assign({ location: this._location + '/' + name }, opts));
        }
        return this._stores[name];
    };
    Database.prototype.startup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var meta;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MetaStore_1.default.get(this._metaPath)];
                    case 1:
                        meta = _a.sent();
                        if (!meta) {
                            return [2 /*return*/];
                        }
                        this._meta = meta;
                        if (meta.collections) {
                            meta.collections.forEach(function (info) {
                                var name = info.name, rest = __rest(info, ["name"]);
                                _this._stores[name] = _this.createCollection(name, rest);
                            });
                        }
                        if (meta.auth) {
                            this.auth();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Database;
}());
exports.default = Database;
