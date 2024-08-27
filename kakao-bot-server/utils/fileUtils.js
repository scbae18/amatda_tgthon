const fs = require('fs');
const path = require('path');

exports.getFolderPath = (userMessage) => {
    let folderPath = '';
    switch (userMessage) {
        case '학사':
            folderPath = 'path/to/academic_folder';
            break;
        case '채용':
            folderPath = 'path/to/recruitment_folder';
            break;
        case '행사':
            folderPath = 'path/to/event_folder';
            break;
        case '장학':
            folderPath = 'path/to/scholarship_folder';
            break;
        default:
            return null;
    }
    return folderPath;
};

exports.readFilesFromFolder = (folderPath, callback) => {
    fs.readdir(folderPath, (err, files) => {
        if (err) return callback(err);

        const txtFiles = files.filter(file => path.extname(file).toLowerCase() === '.txt');
        const fileContents = [];
        let filesProcessed = 0;

        if (txtFiles.length === 0) {
            return callback(null, []);
        }

        txtFiles.forEach(file => {
            fs.readFile(path.join(folderPath, file), 'utf8', (err, data) => {
                if (err) return callback(err);

                fileContents.push(data);
                filesProcessed++;

                if (filesProcessed === txtFiles.length) {
                    callback(null, fileContents);
                }
            });
        });
    });
};
