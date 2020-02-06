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
var MetaStore_1 = __importDefault(require("./internal/MetaStore"));
var _1 = __importDefault(require("."));
var ProjectManager = /** @class */ (function () {
    function ProjectManager(props) {
        var _this = this;
        this._projects = {};
        this._config = { setupCompleted: true };
        this.get = function (name) {
            return _this._projects[name];
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
        this._metaPath = location + "/_meta";
        this._startup.bind(this)();
        console.log('\x1b[36m%s\x1b[0m', "Initiate a DatabaseManager instance at " + location);
    }
    ProjectManager.prototype.create = function (name, opts) {
        var db = this._projects[name];
        if (!db) {
            db = new _1.default({ location: this.location + '/' + name });
            this._projects[name] = db;
        }
        return this._projects[name];
    };
    ProjectManager.prototype.list = function () {
        var dbNames = Object.keys(this._projects);
        var dbs = new Array(dbNames.length);
        dbNames.forEach(function (name, i) {
            dbs[i] = { name: name };
        });
        return dbs;
    };
    ProjectManager.prototype.config = function (key) {
        // @ts-ignore
        return this._config[key];
    };
    ProjectManager.prototype._saveMeta = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dbs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dbs = {
                        // _config: {
                        //     setupCompleted: await this._token.count("server") !== 0
                        // }
                        };
                        Object.keys(this._projects).forEach(function (db) {
                            dbs[db] = { name: db };
                        });
                        return [4 /*yield*/, MetaStore_1.default.save(this._metaPath, dbs)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProjectManager.prototype._startup = function () {
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
                            _this._projects[name] = _this.create(rest[name].name);
                        });
                        if (_config) {
                            this._config = _config;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return ProjectManager;
}());
exports.default = ProjectManager;
