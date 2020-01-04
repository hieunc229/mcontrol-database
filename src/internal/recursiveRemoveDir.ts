const fs = require('fs');
const Path = require('path');

async function deleteDirRecursive(path: string) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file: string, index: number) => {
            const curPath = Path.join(path, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteDirRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

export { deleteDirRecursive };