"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var DatabaseManager_1 = __importDefault(require("./DatabaseManager"));
var Auth_1 = __importDefault(require("./Auth"));
exports.Auth = Auth_1.default;
exports.default = DatabaseManager_1.default;
