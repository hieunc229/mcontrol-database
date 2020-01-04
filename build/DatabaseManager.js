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
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var Database_1 = __importDefault(require("./Database"));
var MetaStore_1 = __importDefault(require("./internal/MetaStore"));
var FilebaseToken_1 = require("./token/FilebaseToken");
var DatabaseManager = /** @class */ (function () {
    function DatabaseManager(props) {
        var _this = this;
        this.databases = {};
        this._config = { setupCompleted: true };
        this.db = function (name) {
            // return this._getDB(name);
            return _this.databases[name];
        };
        this.saveMeta = this._saveMeta;
        var location = props.location;
        if (location && location[location.length - 1] === '/') {
            location = location.substr(0, location.length - 1);
        }
        this.location = location;
        this.saveMeta = this.saveMeta.bind(this);
        this._saveMeta = this._saveMeta.bind(this);
        if (!fs_1.default.existsSync(location)) {
            fs_1.default.mkdirSync(location);
        }
        this._token = new FilebaseToken_1.Filebase_TokenManager({ path: location });
        this._metaPath = location + "/_meta";
        this._startup.bind(this)();
        console.log('\x1b[36m%s\x1b[0m', "Initiate a DatabaseManager instance at " + location);
    }
    DatabaseManager.prototype.token = function () {
        return this._token;
    };
    DatabaseManager.prototype.createDB = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (name in this.databases) {
                            throw Error("Database has already exists");
                        }
                        db = new Database_1.default({ location: this.location + '/' + name });
                        this.databases[name] = db;
                        return [4 /*yield*/, this._saveMeta()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, db];
                }
            });
        });
    };
    DatabaseManager.prototype.create = function (name, opts) {
        var db = this.databases[name];
        if (!db) {
            db = new Database_1.default({ location: this.location + '/' + name });
            this.databases[name] = db;
        }
        opts && opts.forEach(function (col) {
            var name = col.name, indexes = col.indexes, autoIndexEnabled = col.autoIndexEnabled;
            db.collection(name, { indexes: indexes, autoIndexEnabled: autoIndexEnabled });
        });
        return this.databases[name];
    };
    DatabaseManager.prototype.dbs = function () {
        var dbNames = Object.keys(this.databases);
        var dbs = new Array(dbNames.length);
        dbNames.forEach(function (name, i) {
            dbs[i] = { name: name };
        });
        return dbs;
    };
    DatabaseManager.prototype.config = function (key) {
        // @ts-ignore
        return this._config[key];
    };
    DatabaseManager.prototype._saveMeta = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dbs, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = {};
                        _b = {};
                        return [4 /*yield*/, this._token.count("server")];
                    case 1:
                        dbs = (_a._config = (_b.setupCompleted = (_c.sent()) !== 0,
                            _b),
                            _a);
                        Object.keys(this.databases).forEach(function (db) {
                            dbs[db] = { name: db };
                        });
                        return [4 /*yield*/, MetaStore_1.default.save(this._metaPath, dbs)];
                    case 2:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DatabaseManager.prototype._startup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var meta, _config, rest;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MetaStore_1.default.get(this._metaPath)];
                    case 1:
                        meta = _a.sent();
                        if (!meta)
                            return [2 /*return*/];
                        _config = meta._config, rest = __rest(meta, ["_config"]);
                        Object.keys(rest).forEach(function (name) {
                            _this.databases[name] = _this.create(rest[name].name);
                        });
                        if (_config) {
                            this._config = _config;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return DatabaseManager;
}());
exports.default = DatabaseManager;
