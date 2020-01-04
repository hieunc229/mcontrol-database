"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var DatabaseManager_1 = __importDefault(require("../DatabaseManager"));
var databaseManager = new DatabaseManager_1.default({
    location: process.env.STORAGE_DIR
});
exports.default = databaseManager;
