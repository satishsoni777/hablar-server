import fs from 'fs';
import path from 'path';

const getInitData = async (params, callback) => {
    const projectPath = path.resolve(process.cwd());
    const filePath = projectPath + '/assets/json_config/more_options.json';
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) return callback(err, null);
        var obj = JSON.parse(data);
        return callback(null, obj);
    });
}

export const InitData = { getInitData };