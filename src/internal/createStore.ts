import * as fs from "fs";
import levelup, { LevelUp } from "levelup";
import rocksdb from "rocksdb";

export function createStore(location: string): LevelUp {
    if (!fs.existsSync(location)) {
        fs.mkdirSync(location);
    }
    return levelup(rocksdb(location));
}