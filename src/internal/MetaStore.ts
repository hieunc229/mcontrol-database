import * as fs from "fs";

export async function save(path: string, data: any) {
    fs.writeFileSync(path, JSON.stringify({ data }));
}

export async function load(path: string) {
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path, "utf8");
        return JSON.parse(data).data;
    }
    return undefined
}

const metastore = { save, load, get: load };
export default metastore;