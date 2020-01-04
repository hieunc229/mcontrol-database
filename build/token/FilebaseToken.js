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
var shortid_1 = __importDefault(require("shortid"));
var crypto_1 = __importDefault(require("crypto"));
var MetaStore_1 = __importDefault(require("../internal/MetaStore"));
var Filebase_TokenManager = /** @class */ (function () {
    function Filebase_TokenManager(props) {
        this._clients = [];
        this._servers = [];
        this.ready = false;
        this._path = props.path + '/_tokens';
        this._startup = this._startup.bind(this);
        this._createToken = this._createToken.bind(this);
        this._startup();
    }
    Filebase_TokenManager.prototype.count = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(["server", "client"].indexOf(type) !== -1)) return [3 /*break*/, 3];
                        if (!!this["_" + type + "s"]) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._startup()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this["_" + type + "s"].length];
                    case 3: throw Error("Invalid token type " + type);
                }
            });
        });
    };
    Filebase_TokenManager.prototype._createToken = function (type) {
        if (["server", "client"].indexOf(type) !== -1) {
            var token = "CJ" + (type === "server" ? 'S' : 'C') + "-" + shortid_1.default.generate() + "-" + shortid_1.default.generate();
            this["_" + type + "s"].push(this._getToken(token));
            return token;
        }
        throw Error("Invalid token type " + type);
    };
    Filebase_TokenManager.prototype.generate = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = this._createToken(type);
                        return [4 /*yield*/, this._save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, token];
                }
            });
        });
    };
    Filebase_TokenManager.prototype.generateMultiple = function () {
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var data, token;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = { clientToken: [], serverToken: [] };
                        types.forEach(function (type) {
                            token = _this._createToken(type);
                            data[type + "Token"].push(token);
                        });
                        return [4 /*yield*/, this._save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    Filebase_TokenManager.prototype.validate = function (type, token) {
        if (["server", "client"].indexOf(type) !== -1) {
            return this["_" + type + "s"].indexOf(this._getToken(token)) !== -1;
        }
        throw Error("Invalid token type " + type);
    };
    Filebase_TokenManager.prototype.revoke = function (type, token) {
        if (["server", "client"].indexOf(type) !== -1) {
            var index = this["_" + type + "s"].indexOf(this._getToken(token));
            if (index === -1) {
                throw Error("Token " + token + " does not exists");
            }
            this["_" + type + "s"].splice(index, 1);
            return true;
        }
        throw Error("Invalid token type " + type);
    };
    Filebase_TokenManager.prototype._getToken = function (token) {
        return crypto_1.default.createHash('sha256').update(token).digest('hex');
    };
    Filebase_TokenManager.prototype._startup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var meta;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MetaStore_1.default.get(this._path)];
                    case 1:
                        meta = _a.sent();
                        this.ready = true;
                        if (!meta)
                            return [2 /*return*/];
                        meta.clients && (this._clients = meta.clients);
                        meta.servers && (this._servers = meta.servers);
                        return [2 /*return*/];
                }
            });
        });
    };
    Filebase_TokenManager.prototype._getMeta = function () {
        return {
            servers: this._servers,
            clients: this._clients
        };
    };
    Filebase_TokenManager.prototype._save = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MetaStore_1.default.save(this._path, this._getMeta())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Filebase_TokenManager;
}());
exports.Filebase_TokenManager = Filebase_TokenManager;
